import { css, html, LitElement, nothing } from 'lit';
import { until } from 'lit/directives/until.js';

const licensesUrl = new URL('../../public/3rd-party-licenses.txt', import.meta.url);

const fetchData = async () => {
  const response = await fetch(licensesUrl.pathname);
  return response.text();
};

export class AboutView extends LitElement {
  static get properties() {
    return {
      licenses: { state: true },
      show: { state: true },
    };
  }

  static get styles() {
    return css`
      a {
        color: var(--mdc-theme-primary);
      }
    `;
  }

  constructor() {
    super();
    this.licenses = fetchData();
    this.show = false;
  }

  render() {
    return html`<h1>About</h1>
      <p>Version: <code>__BUILD_VERSION__</code></p>
      <p><a href="https://github.com/inventage/amenity-finder">https://github.com/inventage/amenity-finder</a></p>
      <p><a href="#" @click="${this._toggleShow}">Made possible by third-party software</a></p>
      ${!this.show
        ? nothing
        : html`<h2>Licenses</h2>
            <pre>${until(this.licenses, html`Loading…`)}</pre>`}`;
  }

  _toggleShow(e) {
    e.preventDefault();
    this.show = !this.show;
  }
}

customElements.define('about-view', AboutView);
