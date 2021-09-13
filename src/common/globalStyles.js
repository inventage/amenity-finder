import { css } from 'lit';

/**
 * Shared component styles
 *
 * @see https://lit-element.polymer-project.org/guide/styles#shadow-dom-styles
 */
export const sharedStyles = css`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none;
  }

  a {
    color: var(--mdc-theme-primary);
  }

  h1 {
    margin-top: 0;
  }
`;
