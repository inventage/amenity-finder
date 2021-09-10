import { LitElement, html, css } from 'lit';
import page from 'page';

import '@material/mwc-drawer';
import '@material/mwc-top-app-bar';
import '@material/mwc-list/mwc-list.js';
import '@material/mwc-list/mwc-list-item.js';
import '@material/mwc-icon-button';

import './views/HomeView.js';
import './views/ResultsView.js';
import './views/SearchView.js';

export class AmenityFinder extends LitElement {
  static get properties() {
    return {
      showSidebar: { type: Boolean },
      currentView: { type: String },
      latitude: { type: String },
      longitude: { type: String },
      radius: { type: Number },
    };
  }

  static get styles() {
    return css`
      :host {
        min-height: 100vh;
      }

      main {
        padding: var(--amenity-container-padding, 1rem);
      }
    `;
  }

  constructor() {
    super();
    this.showSidebar = false;
    this.currentView = 'home';

    this.latitude = '47.3902';
    this.longitude = '8.5158';
    this.radius = 1000;

    this._initializeRoutes();
  }

  render() {
    return html`
      <mwc-drawer hasHeader type="modal" .open="${this.showSidebar}" @MDCDrawer:closed="${this._closeSidebar}">
        <span slot="title">Navigation</span>
        <mwc-list>
          <mwc-list-item @click="${() => this._navigateToUrl('/')}">Home</mwc-list-item>
          <mwc-list-item @click="${() => this._navigateToUrl('/search')}">Search</mwc-list-item>
          <mwc-list-item @click="${() => this._navigateToUrl('/results')}">Results</mwc-list-item>
        </mwc-list>
        <div slot="appContent">
          <mwc-top-app-bar>
            <mwc-icon-button
              icon="menu"
              slot="navigationIcon"
              @click="${() => {
                this.showSidebar = !this.showSidebar;
              }}"
            ></mwc-icon-button>
            <div slot="title">Title</div>
          </mwc-top-app-bar>
          <main>${this._renderCurrentView()}</main>
        </div>
      </mwc-drawer>
    `;
  }

  _renderCurrentView() {
    switch (this.currentView) {
      case 'home':
        return html`<home-view></home-view>`;
      case 'search':
        return html`<search-view
          .latitude="${this.latitude}"
          .longitude="${this.longitude}"
          .radius="${this.radius}"
          @execute-search="${e => this._onExecuteSearch(e)}"
        ></search-view>`;
      case 'results':
        return html`<results-view></results-view>`;
      default:
        return ``;
    }
  }

  _initializeRoutes() {
    page('/', () => {
      this.currentView = 'home';
    });
    page('/results/:lat/:lon/:radius', ctx => {
      this._setSearchParametersFromRouteContext(ctx);
      this.currentView = 'results';
    });
    page('/search', () => {
      this.currentView = 'search';
    });
    page();
  }

  _navigateToUrl(url) {
    page(url);
    this._closeSidebar();
  }

  _closeSidebar() {
    this.showSidebar = false;
  }

  // eslint-disable-next-line class-methods-use-this
  _onExecuteSearch(e) {
    page(`/results/${e.detail.latitude}/${e.detail.longitude}/${e.detail.radius}`);
  }

  _setSearchParametersFromRouteContext(ctx) {
    const {
      params: { radius, lat, lon },
    } = ctx;

    if (!radius || !lat || !lon) {
      return;
    }

    this.radius = radius;
    this.latitude = lat;
    this.longitude = lon;
  }
}

customElements.define('amenity-finder', AmenityFinder);