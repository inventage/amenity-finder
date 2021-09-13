import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';

class LazyLoadDirective extends AsyncDirective {
  render(importPromise, value) {
    // TODO: Implement signaling pending state…
    return value;
  }
}

export const lazyLoad = directive(LazyLoadDirective);
