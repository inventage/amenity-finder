// noinspection ExceptionCaughtLocallyJS

import { SplashScreen } from '@capacitor/splash-screen';
import { Workbox } from 'workbox-window';

/**
 * In order for the splash screen to be visible, we delay the hiding by the given amount (in ms)
 *
 * @type {number}
 */
const SPLASH_SCREEN_HIDE_DELAY = 1000;

const hideSplashScreen = () => {
  setTimeout(async () => {
    await SplashScreen.hide();
  }, SPLASH_SCREEN_HIDE_DELAY);
};

(async () => {
  try {
    const appElement = document.querySelector('amenity-finder');
    if (!appElement) {
      throw new Error('Could not find app DOM element!');
    }

    // Things to do as soon as the app (shell) has rendered for the first time
    appElement.addEventListener('rendered', () => {
      // Hide when app has rendered initially
      hideSplashScreen();

      // Initialize service worker
      if ('__ENABLE_SW__' === 'true' && 'serviceWorker' in navigator) {
        const wb = new Workbox('./sw.js');

        // @see https://dev.to/webmaxru/workbox-4-implementing-refresh-to-update-version-flow-using-the-workbox-window-module-4e3c
        wb.addEventListener('installed', event => {
          if (event.isUpdate) {
            document.dispatchEvent(new Event('app-update-available'));
          }
        });

        wb.register()
          .then(value => console.info('Service worker registered.', value))
          .catch(e => console.error('Service worker registration failed.', e));
      }
    });

    // Load entry component
    await import('./AmenityFinder.js');
  } catch (e) {
    console.error('An error occurred when initializing the application:', e);
    hideSplashScreen();
  }
})();
