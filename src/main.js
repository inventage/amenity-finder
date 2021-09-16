// noinspection ExceptionCaughtLocallyJS

import { SplashScreen } from '@capacitor/splash-screen';

(async () => {
  try {
    const appElement = document.querySelector('amenity-finder');
    if (!appElement) {
      throw new Error('Could not find app DOM element!');
    }

    // Hide when app has rendered initially
    appElement.addEventListener('rendered', async () => {
      await SplashScreen.hide();
    });

    // Load entry component
    await import('./AmenityFinder.js');
  } catch (e) {
    console.error('An error occurred when initializing the application:', e);
    await SplashScreen.hide();
  }
})();
