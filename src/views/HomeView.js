import { css, html, LitElement } from 'lit';

import '@material/mwc-button';

const logo = new URL('../../assets/img/amenity-finder-logo.png', import.meta.url);

export class HomeView extends LitElement {
  static get styles() {
    return css`
      :host {
        width: 100%;
        display: grid;
        place-items: center;
      }

      .banner {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .logo {
        width: 100%;
        height: auto;
        max-height: 200px;
        margin-bottom: 3rem;
        object-fit: contain;
      }

      .button {
        white-space: nowrap;
      }
    `;
  }

  /**
   * TODO: We could inject a "routing" service here and route to /search through that?
   *
   * @returns {*}
   */
  render() {
    return html`<div class="banner">
      <img src="${logo}" alt="Amenity Finder Logo" class="logo" />
      <mwc-button label="Start a search" outlined @click="${() => (window.location = '/search')}" class="button"></mwc-button>
    </div>`;
  }
}

customElements.define('home-view', HomeView);
