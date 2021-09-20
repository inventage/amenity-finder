import { LitElement, html, css } from 'lit';
import page from 'page';

import '@material/mwc-drawer';
import '@material/mwc-top-app-bar';
import '@material/mwc-linear-progress';
import '@material/mwc-list/mwc-list.js';
import '@material/mwc-list/mwc-list-item.js';
import '@material/mwc-icon';
import '@material/mwc-icon-button';

import { lazyLoad } from './directives/lazyLoadDirective.js';
import { Provider } from './mixins/ProviderMixin.js';
import { OverpassApi } from './services/OverpassApi.js';
import { PendingContainer } from './mixins/PendingContainerMixin.js';

export class AmenityFinder extends PendingContainer(Provider(LitElement), 250) {
  static get properties() {
    return {
      showSidebar: { type: Boolean },
      currentView: { type: String },
      alreadySearched: { type: Boolean },
      latitude: { type: String },
      longitude: { type: String },
      radius: { type: Number },
      rendered: { type: Boolean, reflect: true },
    };
  }

  static get styles() {
    return css`
      :host {
        --amenity-container-padding: 1rem;
        --amenity-finder-top-bar-height: 56px;

        --mdc-list-side-padding: calc(16px + var(--safe-area-inset-left));
      }

      @media (min-width: 600px) {
        :host {
          --amenity-finder-top-bar-height: 64px;
        }
      }

      a {
        color: var(--mdc-theme-primary);
      }

      main {
        box-sizing: border-box;
        padding: var(--amenity-container-padding, 1rem);
        display: flex;
        flex: 1;
        max-height: calc(100vh - var(--amenity-finder-top-bar-height) - var(--safe-area-inset-top, 0));
        overflow: auto;
      }

      .sidebar {
        position: relative;
        z-index: 1337;
      }

      [slot='appContent'] {
        display: flex;
        flex-direction: column;
        height: 100%;
        background-color: var(--amenity-finder-page-background-color);

        /* fixes issues where content would overlay sidebar */
        z-index: 1;
        position: relative;
      }

      mwc-top-app-bar > [slot='title'] a {
        color: inherit;
        text-decoration: none;
      }

      mwc-linear-progress {
        position: fixed;
        top: calc(var(--amenity-finder-top-bar-height) + var(--safe-area-inset-top, 0));
        left: 0;
        right: 0;
        z-index: 2;
      }

      .navigation-footer {
        display: flex;
        flex-direction: column;
        padding: 2rem var(--mdc-list-side-padding, 16px) 0;
        font-family: var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));
        font-size: 85%;
      }

      .navigation-footer > .item {
        margin-bottom: 0.5rem;
      }

      .navigation-footer > .item:last-child {
        margin-bottom: 0;
      }

      .back-link {
        margin: 1rem 0;
        display: flex;
        align-items: center;
      }

      .back-link > .icon {
        color: var(--mdc-theme-primary);
        margin-right: 0.25rem;
      }

      @supports (padding-top: env(safe-area-inset-top)) {
        [slot='appContent'] {
          padding-top: var(--safe-area-inset-top, 0);
          position: fixed;
          overflow: hidden;
          width: 100%;
        }

        mwc-drawer > [slot='title'] {
          position: relative;
          top: var(--safe-area-inset-top, 0);
          padding-left: var(--safe-area-inset-left, 0);
        }

        mwc-list {
          margin-top: var(--safe-area-inset-top, 0);
        }
      }
    `;
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.rendered = true;
    this.dispatchEvent(
      new CustomEvent('rendered', {
        detail: true,
      })
    );
  }

  updated(changedProperties) {
    super.updated(changedProperties);

    // Always close sidebar when view changes
    if (changedProperties.has('currentView')) {
      this.showSidebar = false;
    }
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

    // Provide services
    this.provideInstance('api', new OverpassApi());
  }

  render() {
    return html`
      <mwc-linear-progress indeterminate .closed="${!this.__hasPendingChildren}"></mwc-linear-progress>
      <mwc-drawer hasHeader type="modal" .open="${this.showSidebar}" @MDCDrawer:closed="${this._closeSidebar}">
        <span slot="title">Navigation</span>
        <mwc-list>
          <mwc-list-item @click="${() => this._navigateToUrl('/')}">Home</mwc-list-item>
          <mwc-list-item @click="${() => this._navigateToUrl('/search')}">Search</mwc-list-item>
          <mwc-list-item @click="${() => this._navigateToUrl('/results')}">Results</mwc-list-item>
        </mwc-list>
        <div class="navigation-footer">
          <a href="/about" class="item">About</a>
          <a href="/policy" class="item">Privacy Policy</a>
        </div>

        <div slot="appContent">
          <mwc-top-app-bar>
            <mwc-icon-button icon="menu" slot="navigationIcon" @click="${this._toggleSidebar}"></mwc-icon-button>
            <div slot="title"><a href="/">Amenity Finder</a></div>
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
      case 'about':
        return lazyLoad(import('./views/AboutView.js'), html`<about-view></about-view>`);
      case 'policy':
        return lazyLoad(import('./views/PrivacyPolicyView.js'), html`<privacy-policy-view></privacy-policy-view>`);
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
            <p class="back-link">
              <mwc-icon class="icon">chevron_left</mwc-icon>
              <a href="${`/search/${this.latitude}/${this.longitude}/${this.radius}`}" class="link">Back to search</a>
            </p>
          </results-view>`
        );
      default:
        return lazyLoad(import('./views/NotFoundView.js'), html`<not-found-view></not-found-view>`);
    }
  }

  _toggleSidebar(e) {
    e.target.blur();
    this.showSidebar = !this.showSidebar;
  }

  _closeSidebar() {
    this.showSidebar = false;
  }

  _navigateToUrl(url) {
    page(url);

    this.showSidebar = false;
  }

  _initializeRoutes() {
    page('/', () => {
      this.currentView = 'home';
    });
    page('/about', () => {
      this.currentView = 'about';
    });
    page('/policy', () => {
      this.currentView = 'policy';
    });
    page('/results', () => {
      if (this.alreadySearched) {
        page.redirect(`/results/${this.latitude}/${this.longitude}/${this.radius}`);
        return;
      }

      page.redirect('/search');
    });
    page('/results', () => {
      if (this.alreadySearched) {
        page.redirect(`/results/${this.latitude}/${this.longitude}/${this.radius}`);
        return;
      }

      page.redirect('/search');
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
    page('*', () => {
      this.currentView = undefined;
    });
    page();
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
