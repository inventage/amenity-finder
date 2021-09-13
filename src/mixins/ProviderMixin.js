/**
 * Simple implementation of the "dependency resolution protocol".
 *
 * A provider can provide instances of services.
 *
 * @param Base Base class to extend
 * @property {Map} __instances
 * @constructor
 */
export const Provider = Base =>
  class extends Base {
    constructor() {
      super();

      this.__instances = new Map();

      this.addEventListener('request-instance', event => {
        const { key } = event.detail;
        if (this.__instances.has(key)) {
          // eslint-disable-next-line no-param-reassign
          event.detail.instance = this.__instances.get(key);

          // We do not need to propagate the event any further, since we've reached
          // a provider that takes care of providing an instance.
          event.stopPropagation();
        }
      });
    }

    /**
     * Register an instance under the given key.
     *
     * @param key
     * @param instance
     */
    provideInstance(key, instance) {
      this.__instances.set(key, instance);
    }
  };
