/* eslint-disable no-restricted-globals */
import { clientsClaim } from 'workbox-core';
import { googleFontsCache } from 'workbox-recipes';
import { precacheAndRoute } from 'workbox-precaching';

googleFontsCache();

// if (process.env.NODE_ENV === 'production') {
//   console.info('foo');
// }

clientsClaim();
self.skipWaiting();

// For injecting manifest
precacheAndRoute(self.__WB_MANIFEST);
