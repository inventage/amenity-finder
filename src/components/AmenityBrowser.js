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
      selectedMarker: { type: Object, attribute: false },
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
    this.selectedMarker = null;
  }

  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('amenities')) {
      this._updateMarkersFromResults();
    }
  }

  render() {
    return html`<div class="amenities">${this._renderAmenities()}</div>
      <leaflet-map
        .latitude="${this.latitude}"
        .longitude="${this.longitude}"
        .radius="${this.radius}"
        .markers="${this.markers}"
        .selectedMarker="${this.selectedMarker}"
        @tiles-loading="${e => {
          this.dispatchEvent(
            new CustomEvent('pending-state', {
              composed: true,
              bubbles: true,
              detail: {
                promise: e.detail.promise,
              },
            })
          );
        }}"
      ></leaflet-map>`;
  }

  _renderAmenities() {
    if (!this._hasAmenities()) {
      return nothing;
    }

    return html`${this.amenities.map(result => {
      const {
        id,
        distance,
        tags: { name },
      } = result;

      return html`<amenity-item
        .name="${name}"
        .distance="${distance}"
        .selected="${this.selectedMarker && this.selectedMarker.id === id}"
        @click="${() => this._selectMarker(id)}"
      ></amenity-item>`;
    })}`;
  }

  _selectMarker(id) {
    const selectedMarker = this.markers.find(marker => marker.id === id);
    if (selectedMarker) {
      this.selectedMarker = selectedMarker;
    }
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
