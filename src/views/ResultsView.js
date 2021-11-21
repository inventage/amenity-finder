import { css, html, LitElement, nothing } from 'lit';
import '@material/mwc-icon';

import '../components/AmenityBrowser.js';
import '../components/AmenityItem.js';
import { distanceBetween } from '../utils/geolocation.js';
import { Requester } from '../mixins/RequesterMixin.js';
import { sharedStyles } from '../common/globalStyles.js';
import { delay } from '../utils/helpers.js';

export class ResultsView extends Requester(LitElement) {
  static get properties() {
    return {
      latitude: { type: String },
      longitude: { type: String },
      radius: { type: Number },
      type: { type: String },
      results: { state: true },
      loading: { state: true },
      reloading: { state: true },
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

        .page-title {
          display: flex;
          align-items: center;
        }

        .page-title > .icon {
          margin-left: 0.5rem;
        }

        .refresh-toggle {
          cursor: pointer;
        }

        amenity-browser,
        .reloading-placeholder {
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
    this.reloading = false;
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
        <h1 class="page-title">Results <mwc-icon class="icon refresh-toggle" @click="${this._refresh}">autorenew</mwc-icon></h1>
        <p>
          Displaying <strong>${this.results.length} results</strong> for <code>latitude</code> = <code>${this.latitude}</code>, <code>longitude</code> =
          <code>${this.longitude}</code>, <code>radius</code> = <code>${this.radius}</code> and <code>type</code> = <code>${this.type}</code></code>
        </p>
        <slot></slot>
      </div>
      <amenity-browser
        .amenities="${this.results}"
        .latitude="${this.latitude}"
        .longitude="${this.longitude}"
        .radius="${this.radius}"
        .loading="${this.loading || this.reloading}"
      ></amenity-browser>`;
  }

  _canSearch() {
    return this.latitude && this.longitude && this.radius;
  }

  async _fetchResults() {
    this.loading = true;
    const resultsPromise = this.api.getNodeByLatLng(this.latitude, this.longitude, this.radius, this.type);
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

  async _refresh(e) {
    e.preventDefault();

    if (this.loading) {
      return;
    }

    this.results = [];
    this.reloading = true;

    try {
      await this._fetchResults();
      await delay(10000);
    } catch (err) {
      console.error(err);
    } finally {
      this.reloading = false;
    }
  }
}

customElements.define('results-view', ResultsView);
