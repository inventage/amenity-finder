import { css, html, LitElement } from 'lit';

import '@material/mwc-icon';
import '@material/mwc-button';

export class NotFoundView extends LitElement {
  static get styles() {
    return css`
      :host {
        width: 100%;
        display: grid;
        place-items: center;
      }

      main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      mwc-icon {
        color: --mdc-theme-primary;
        --mdc-icon-size: 4rem;
      }

      mwc-button {
        margin-top: 1rem;
      }
    `;
  }

  render() {
    return html`
      <main>
        <mwc-icon>report_problem</mwc-icon>
        <h1>Not found</h1>
        <p>We could not find the page you were looking for.</p>
        <mwc-button outlined label="Homepage" @click="${() => (window.location = '/')}"></mwc-button>
      </main>
    `;
  }
}

customElements.define('not-found-view', NotFoundView);
