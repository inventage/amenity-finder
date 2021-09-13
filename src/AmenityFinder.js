import { LitElement, html, css } from 'lit';
import page from 'page';

import '@material/mwc-drawer';
import '@material/mwc-top-app-bar';
import '@material/mwc-list/mwc-list.js';
import '@material/mwc-list/mwc-list-item.js';
import '@material/mwc-icon-button';

import { lazyLoad } from './directives/lazyLoadDirective.js';

export class AmenityFinder extends LitElement {
  static get properties() {
    return {
      showSidebar: { type: Boolean },
      currentView: { type: String },
      alreadySearched: { type: Boolean },
      latitude: { type: String },
      longitude: { type: String },
      radius: { type: Number },
    };
  }

  static get styles() {
    return css`
      :host {
        --amenity-container-padding: 1rem;
      }

      main {
        padding: var(--amenity-container-padding, 1rem);
        box-sizing: border-box;
        display: flex;
        flex: 1;
        max-height: calc(100vh - 64px);
      }

      [slot='appContent'] {
        display: flex;
        flex-direction: column;
        height: 100%;

        /* fixes issues where content would overlay sidebar */
        z-index: 1;
        position: relative;
      }
    `;
  }

  constructor() {
    super();
    this.showSidebar = false;
    this.currentView = 'home';
    this.alreadySearched = false;

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
            <div slot="title">Amenity Finder</div>
          </mwc-top-app-bar>
          <main>${this._renderCurrentView()}</main>
        </div>
      </mwc-drawer>
    `;
  }

  _renderCurrentView() {
    switch (this.currentView) {
      case 'home':
        return lazyLoad(import('./views/HomeView.js'), html`<home-view></home-view>`);
      case 'search':
        return lazyLoad(
          import('./views/SearchView.js'),
          html`<search-view
            .latitude="${this.latitude}"
            .longitude="${this.longitude}"
            .radius="${this.radius}"
            @execute-search="${e => this._onExecuteSearch(e)}"
          ></search-view>`
        );
      case 'results':
        return lazyLoad(
          import('./views/ResultsView.js'),
          html`<results-view .latitude="${this.latitude}" .longitude="${this.longitude}" .radius="${this.radius}">
            <p><a href="${`/search/${this.latitude}/${this.longitude}/${this.radius}`}">← Back to search</a></p>
          </results-view>`
        );
      default:
        return ``;
    }
  }

  _initializeRoutes() {
    page('/', () => {
      this.currentView = 'home';
    });
    page('/results', () => {
      if (this.alreadySearched) {
        page.redirect(`/results/${this.latitude}/${this.longitude}/${this.radius}`);
        return;
      }

      page.redirect('/search');
    });
    page('/results/:lat/:lon/:radius', ctx => {
      this._setSearchParametersFromRouteContext(ctx);
      this.currentView = 'results';
    });
    page('/search', () => {
      if (this.alreadySearched) {
        page.redirect(`/search/${this.latitude}/${this.longitude}/${this.radius}`);
        return;
      }

      this.currentView = 'search';
    });
    page('/search/:lat/:lon/:radius', ctx => {
      this._setSearchParametersFromRouteContext(ctx);
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
    this.alreadySearched = true;
  }
}

customElements.define('amenity-finder', AmenityFinder);
