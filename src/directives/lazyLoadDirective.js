import { directive, PartType } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';

const trackedValues = [];

class LazyLoadDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    // Only allow the directive to be applied to CHILD expression types
    // @see https://lit.dev/docs/templates/custom-directives/#limiting-a-directive-to-one-expression-type
    if (partInfo.type !== PartType.CHILD) {
      throw new Error('The `lazyLoad` directive must be used on elements');
    }
  }

  update(part, [importPromise, value]) {
    // A TemplateResult object will always have the `strings` property set
    const { strings: valueIdentifier = '' } = value;
    if (valueIdentifier && !trackedValues.includes(valueIdentifier)) {
      trackedValues.push(valueIdentifier);

      // Signal pending state…
      const event = new CustomEvent('pending-state', {
        composed: true,
        bubbles: true,
        detail: { promise: importPromise },
      });

      part.parentNode.dispatchEvent(event);
    }

    return this.render(importPromise, value);
  }

  render(importPromise, value) {
    return value;
  }
}

export const lazyLoad = directive(LazyLoadDirective);
