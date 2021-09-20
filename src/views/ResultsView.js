import { css, html, LitElement, nothing } from 'lit';

import '../components/AmenityBrowser.js';
import '../components/AmenityItem.js';
import { distanceBetween } from '../utils/geolocation.js';
import { Requester } from '../mixins/RequesterMixin.js';
import { sharedStyles } from '../common/globalStyles.js';

export class ResultsView extends Requester(LitElement) {
  static get properties() {
    return {
      latitude: { type: String },
      longitude: { type: String },
      radius: { type: Number },
      results: { type: Array, attribute: false },
      loading: { type: Boolean, attribute: false },
    };
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          width: 100%;
          display: flex;
          flex-direction: column;
          font-size: 1rem;
        }

        .upper {
          padding-left: var(--safe-area-inset-left, 0);
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
      `,
    ];
  }

  constructor() {
    super();
    this.results = [];
    this.loading = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.api = this.requestInstance('api');
  }

  async firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    await this._fetchResults();
  }

  render() {
    if (!this._canSearch()) {
      return nothing;
    }

    return html`<div class="upper">
        <h1>Results</h1>
        <p>
          Displaying <strong>${this.results.length} results</strong> for <code>latitude</code> = <code>${this.latitude}</code>, <code>longitude</code> =
          <code>${this.longitude}</code> and <code>radius</code> = <code>${this.radius}</code>
        </p>
        <slot></slot>
      </div>
      <amenity-browser .amenities="${this.results}" .latitude="${this.latitude}" .longitude="${this.longitude}" .radius="${this.radius}"></amenity-browser>`;
  }

  _canSearch() {
    return this.latitude && this.longitude && this.radius;
  }

  async _fetchResults() {
    this.loading = true;
    const resultsPromise = this.api.getNodeByLatLng(this.latitude, this.longitude, this.radius);
    this.dispatchEvent(
      new CustomEvent('pending-state', {
        composed: true,
        bubbles: true,
        detail: { promise: resultsPromise },
      })
    );

    resultsPromise
      .then(results => {
        this.results = results
          .map(result => ({
            ...result,
            distance: distanceBetween([this.latitude, this.longitude], [result.lat, result.lon]),
          }))
          .sort((a, b) => a.distance - b.distance);
      })
      .catch(err => console.error(err))
      .finally(() => (this.loading = false));
  }
}

customElements.define('results-view', ResultsView);
