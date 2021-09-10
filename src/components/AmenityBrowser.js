import { css, html, LitElement, nothing } from 'lit';
import '@inventage/leaflet-map';

import './AmenityItem.js';

export class AmenityBrowser extends LitElement {
  static get properties() {
    return {
      latitude: { type: String },
      longitude: { type: String },
      radius: { type: Number },
      amenities: { type: Array },

      // Internal properties
      markers: { type: Array, attribute: false },
    };
  }

  static get styles() {
    return css`
      :host {
        display: flex;
      }

      .amenities:not(:empty) {
        width: 70ch;
        max-width: 50vw;
      }

      leaflet-map {
        flex: 1;
        position: sticky;
        top: 0;
        right: 0;
      }
    `;
  }

  constructor() {
    super();

    this.amenities = [];
    this.markers = [];
  }

  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('amenities')) {
      this._updateMarkersFromResults();
    }
  }

  render() {
    return html`<div class="amenities">${this._renderAmenities()}</div>
      <leaflet-map .latitude="${this.latitude}" .longitude="${this.longitude}" .radius="${this.radius}" .markers="${this.markers}"></leaflet-map>`;
  }

  _renderAmenities() {
    if (!this._hasAmenities()) {
      return nothing;
    }

    return html`${this.amenities.map(result => {
      const {
        tags: { name },
      } = result;

      return html`<amenity-item .name="${name}"></amenity-item>`;
    })}`;
  }

  _hasAmenities() {
    return this.amenities.length > 0;
  }

  _updateMarkersFromResults() {
    if (this.amenities.length < 1) {
      return;
    }

    this.markers = this.amenities.map(result => {
      const {
        id,
        lat: latitude,
        lon: longitude,
        tags: { name: title },
      } = result;

      return {
        id,
        latitude,
        longitude,
        title,
      };
    });
  }
}

customElements.define('amenity-browser', AmenityBrowser);
