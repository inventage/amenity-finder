import { css, html, LitElement, nothing } from 'lit';
import '@inventage/leaflet-map';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

import './AmenityItem.js';

export class AmenityBrowser extends LitElement {
  static get properties() {
    return {
      latitude: { type: String },
      longitude: { type: String },
      radius: { type: Number },
      amenities: { type: Array },
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

    this._handleClick = this._handleClick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._handleClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._handleClick);
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
        tags: { name: title, website: url },
      } = result;

      return {
        id,
        latitude,
        longitude,
        title,
        url,
      };
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async _handleClick(e) {
    // Check if the click was issued inside a leaflet popup
    const insideLeafletPopup = e.composedPath().filter(item => item.className === 'leaflet-popup-content').length > 0;
    if (!insideLeafletPopup) {
      return;
    }

    const [target] = e.composedPath();
    if (!target.hasAttribute('href')) {
      return;
    }

    if (!Capacitor.isNativePlatform()) {
      return;
    }

    e.preventDefault();

    const { href } = target;
    await Browser.open({ url: href });
  }
}

customElements.define('amenity-browser', AmenityBrowser);
