/* eslint-disable no-restricted-globals */
import { clientsClaim } from 'workbox-core';
import { googleFontsCache } from 'workbox-recipes';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';

googleFontsCache();

// if (process.env.NODE_ENV === 'production') {
//   console.info('foo');
// }

clientsClaim();
self.skipWaiting();

// For injecting manifest
precacheAndRoute(self.__WB_MANIFEST);

// Fallback to index.html
// @see https://stackoverflow.com/a/66882056
// @see https://developers.google.com/web/tools/workbox/guides/migrations/migrate-from-v4?hl=en#navigation_route_changes
registerRoute(new NavigationRoute(createHandlerBoundToURL('/index.html')));
