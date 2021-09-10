import { html, LitElement } from 'lit';

import { OverpassApi } from '../services/OverpassApi.js';

import '../components/AmenityBrowser.js';
import '../components/AmenityItem.js';

export class ResultsView extends LitElement {
  static get properties() {
    return {
      latitude: { type: String },
      longitude: { type: String },
      radius: { type: Number },
      results: { type: Array, attribute: false },
    };
  }

  constructor() {
    super();

    this.api = new OverpassApi();
    this.results = [];
  }

  async connectedCallback() {
    super.connectedCallback();
    await this._fetchResults();
  }

  render() {
    return html`
      <h1>Results</h1>
      <p>
        Displaying results</strong> for
        <code>latitude</code> = <code>${this.latitude}</code>,
        <code>longitude</code> = <code>${this.longitude}</code> and
        <code>radius</code> = <code>${this.radius}</code>
      </p>
      <amenity-browser .amenities="${this.results}" .latitude="${this.latitude}" .longitude="${this.longitude}" .radius="${this.radius}"></amenity-browser>
    `;
  }

  async _fetchResults() {
    try {
      this.results = await this.api.getNodeByLatLng(this.latitude, this.longitude, this.radius);
    } catch (err) {
      console.error(err);
    }
  }
}

customElements.define('results-view', ResultsView);
