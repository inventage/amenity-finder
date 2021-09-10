import { html, LitElement } from 'lit';
import '@material/mwc-button';
import '@material/mwc-textfield';
import '@inventage/leaflet-map';

export class SearchView extends LitElement {
  static get properties() {
    return {
      latitude: { type: String },
      longitude: { type: String },
      radius: { type: Number },
    };
  }

  constructor() {
    super();

    this.latitude = '47.3902';
    this.longitude = '8.5158';
    this.radius = 1000;
  }

  render() {
    return html`
      <h1>Search</h1>

      <mwc-textfield label="Latitude" .value="${this.latitude}" @keyup="${e => (this.latitude = e.target.value)}"></mwc-textfield>
      <mwc-textfield label="Longitude" .value="${this.longitude}" @keyup="${e => (this.longitude = e.target.value)}"></mwc-textfield>
      <mwc-textfield label="Radius (m)" .value="${this.radius}" @keyup="${e => (this.radius = e.target.value)}"></mwc-textfield>

      <mwc-button outlined label="Locate Me" icon="my_location"></mwc-button>
      <mwc-button raised label="Search"></mwc-button>

      <leaflet-map .latitude="${this.latitude}" .longitude="${this.longitude}" .radius="${this.radius}"></leaflet-map>
    `;
  }
}

customElements.define('search-view', SearchView);
