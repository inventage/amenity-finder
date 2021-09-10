import { html, LitElement, css } from 'lit';

import { OverpassApi } from '../services/OverpassApi.js';

import '../components/AmenityBrowser.js';
import '../components/AmenityItem.js';
import { distanceBetween } from '../utils/geolocation.js';

export class ResultsView extends LitElement {
  static get properties() {
    return {
      latitude: { type: String },
      longitude: { type: String },
      radius: { type: Number },
      results: { type: Array, attribute: false },
    };
  }

  static get styles() {
    return css`
      :host {
        width: 100%;
        display: flex;
        flex-direction: column;
      }

      amenity-browser {
        position: relative;
        overflow-y: auto;
        flex: 1;

        /* stretch to edges */
        margin-left: calc(var(--amenity-container-padding) * -1);
        margin-right: calc(var(--amenity-container-padding) * -1);
        margin-bottom: calc(var(--amenity-container-padding) * -1);
      }
    `;
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
      const results = await this.api.getNodeByLatLng(this.latitude, this.longitude, this.radius);
      this.results = results
        .map(result => ({
          ...result,
          distance: distanceBetween([this.latitude, this.longitude], [result.lat, result.lon]),
        }))
        .sort((a, b) => a.distance - b.distance);
    } catch (err) {
      console.error(err);
    }
  }
}

customElements.define('results-view', ResultsView);
