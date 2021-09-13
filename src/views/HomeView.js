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
    `;
  }

  /**
   * TODO: We could inject a "routing" service here and route to /search through that?
   *
   * @returns {*}
   */
  render() {
    return html`<div class="banner">
      <img src="${logo}" alt="Amenity Finder Logo" />
      <mwc-button label="Start a search" outlined @click="${() => (window.location = '/search')}"></mwc-button>
    </div>`;
  }
}

customElements.define('home-view', HomeView);
