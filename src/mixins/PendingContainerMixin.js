import { delay } from '../utils/helpers.js';

/**
 * Container that oversees all pending requests.
 *
 * @param base Base class to extend
 * @param delayPromise Time in ms to delay promise resolving
 * @property {boolean} __hasPendingChildren
 * @property {number} __pendingCount
 * @constructor
 */
export const PendingContainer = (base, delayPromise = 0) =>
  class extends base {
    static get properties() {
      return {
        __hasPendingChildren: { type: Boolean },
        __pendingCount: { type: Number },
      };
    }

    constructor() {
      super();

      this.__hasPendingChildren = false;
      this.__pendingCount = 0;

      this.addEventListener('pending-state', async e => {
        this.__hasPendingChildren = true;
        this.__pendingCount += 1;

        try {
          await e.detail.promise;
          await delay(delayPromise); // Optional delay
        } catch (err) {
          // Noop
        } finally {
          this.__pendingCount -= 1;
          this.__hasPendingChildren = this.__pendingCount !== 0;
        }
      });
    }
  };
