import { Device } from '@capacitor/device';

(async () => {
  // Device Info
  console.info(await Device.getInfo());

  // Load entry component
  await import('./AmenityFinder.js');
})();
