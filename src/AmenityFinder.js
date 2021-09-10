import { LitElement, html, css } from 'lit';
import '@material/mwc-drawer';
import '@material/mwc-top-app-bar';
import '@material/mwc-list/mwc-list.js';
import '@material/mwc-list/mwc-list-item.js';
import '@material/mwc-icon-button';

export class AmenityFinder extends LitElement {
  static get properties() {
    return {
      showSidebar: {
        type: Boolean,
      },
    };
  }

  static get styles() {
    return css`
      :host {
        min-height: 100vh;
      }
    `;
  }

  constructor() {
    super();
    this.showSidebar = false;
  }

  render() {
    return html`
      <mwc-drawer
        hasHeader
        type="modal"
        .open="${this.showSidebar}"
        @MDCDrawer:closed="${() => {
          this.showSidebar = false;
        }}"
      >
        <span slot="title">Navigation</span>
        <mwc-list>
          <mwc-list-item>Home</mwc-list-item>
          <mwc-list-item>Search</mwc-list-item>
          <mwc-list-item>Results</mwc-list-item>
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
          <div>
            <p>Main Content!</p>
          </div>
        </div>
      </mwc-drawer>
    `;
  }
}

customElements.define('amenity-finder', AmenityFinder);
