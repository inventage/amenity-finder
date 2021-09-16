// noinspection ExceptionCaughtLocallyJS

import { SplashScreen } from '@capacitor/splash-screen';

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

    // Hide when app has rendered initially
    appElement.addEventListener('rendered', hideSplashScreen);

    // Load entry component
    await import('./AmenityFinder.js');
  } catch (e) {
    console.error('An error occurred when initializing the application:', e);
    hideSplashScreen();
  }
})();
