import { LitElement, html, css } from 'lit';
import '@material/mwc-drawer';
import '@material/mwc-top-app-bar';
import '@material/mwc-list/mwc-list.js';
import '@material/mwc-list/mwc-list-item.js';

export class AmenityFinder extends LitElement {
  static get styles() {
    return css`
      :host {
        min-height: 100vh;
      }
    `;
  }

  render() {
    return html`
      <mwc-drawer>
        <div>
          <p>Drawer Content!</p>
        </div>
        <div slot="appContent">
          <mwc-top-app-bar>
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
