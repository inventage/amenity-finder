import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { StatusBar, Style } from '@capacitor/status-bar';

(async () => {
  // Device Info
  console.info(await Device.getInfo());

  if (Capacitor.getPlatform() === 'ios') {
    // Status Bar color
    // await StatusBar.setBackgroundColor({
    //   color: '#004996',
    // });

    await StatusBar.setStyle({ style: Style.Dark });
  }

  // Load entry component
  await import('./AmenityFinder.js');
})();
