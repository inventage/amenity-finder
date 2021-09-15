import { html, LitElement } from 'lit';
import '@material/mwc-button';
import '@material/mwc-textfield';
import '@inventage/leaflet-map';

import { canGeolocate, detectUserLocation, latLongRegexPatternString } from '../utils/geolocation.js';
import styles from './styles/searchViewStyles.js';
import { MAX_SEARCH_RADIUS } from '../common/config.js';

export class SearchView extends LitElement {
  static get properties() {
    return {
      latitude: { type: String },
      longitude: { type: String },
      radius: { type: Number },
      formValid: { type: Boolean, attribute: false },
      isLocating: { type: Boolean, attribute: false },
    };
  }

  static get styles() {
    return styles;
  }

  constructor() {
    super();

    this.formValid = true;
    this.isLocating = false;
  }

  render() {
    return html`<div class="upper search-header">
        <h1>Search</h1>

        <div class="form search-form">
          <div class="search-fields">
            <mwc-textfield
              class="field"
              label="Latitude"
              suffix="°"
              pattern="${latLongRegexPatternString}"
              autoValidate
              validateOnInitialRender
              .value="${this.latitude}"
              @invalid="${e => (this.formValid = e.target.validity.valid)}"
              @keyup="${e => this._handleFieldInput(e, 'latitude')}"
            ></mwc-textfield>
            <mwc-textfield
              class="field"
              label="Longitude"
              suffix="°"
              pattern="${latLongRegexPatternString}"
              autoValidate
              validateOnInitialRender
              .value="${this.longitude}"
              @invalid="${e => (this.formValid = e.target.validity.valid)}"
              @keyup="${e => this._handleFieldInput(e, 'longitude')}"
            ></mwc-textfield>
            <mwc-textfield
              class="field"
              label="Radius"
              type="number"
              suffix="m"
              max="${MAX_SEARCH_RADIUS}"
              autoValidate
              validateOnInitialRender
              .value="${this.radius}"
              @invalid="${e => (this.formValid = e.target.validity.valid)}"
              @change="${e => this._handleFieldInput(e, 'radius')}"
            ></mwc-textfield>
          </div>
          <div class="search-buttons">
            <mwc-button
              outlined
              label="Locate Me"
              icon="my_location"
              @click="${this._handleLocateMeClick}"
              .disabled="${!canGeolocate() || this.isLocating}"
            ></mwc-button>
            <mwc-button raised label="Search" @click="${this._triggerSearch}" .disabled="${!this._canSearch()}"></mwc-button>
          </div>
        </div>
      </div>

      <leaflet-map
        .latitude="${this.latitude}"
        .longitude="${this.longitude}"
        .radius="${this.radius}"
        @center-updated="${this._updateLatitudeLongitudeFromMap}"
        @tiles-loading="${e => {
          const { promise } = e.detail;
          if (!promise) {
            return;
          }

          this.dispatchEvent(
            new CustomEvent('pending-state', {
              composed: true,
              bubbles: true,
              detail: { promise },
            })
          );
        }}"
        updatecenteronclick
      ></leaflet-map> `;
  }

  _handleFieldInput(e, property) {
    // Update form valid state and bail if not valid
    this.formValid = e.target.validity.valid;
    if (!this.formValid) {
      return;
    }

    // Update property
    this[property] = e.target.value;

    // Handle enter key pressed
    const { code } = e;
    if (code === 'Enter') {
      this._triggerSearch();
    }
  }

  _handleLocateMeClick(e) {
    // Blur after click (nicer UI)
    e.target.blur();

    this.isLocating = true;

    // Async user location detection
    detectUserLocation()
      .then(position => {
        const {
          coords: { latitude, longitude },
        } = position;

        console.info('position', position);

        this.latitude = latitude;
        this.longitude = longitude;
      })
      .catch(error => console.error(error))
      .finally(() => (this.isLocating = false));
  }

  _triggerSearch() {
    if (!this._canSearch()) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent('execute-search', {
        detail: {
          latitude: this.latitude,
          longitude: this.longitude,
          radius: this.radius,
        },
      })
    );
  }

  _canSearch() {
    return this.latitude && this.longitude && this.radius && this.formValid;
  }

  _updateLatitudeLongitudeFromMap(e) {
    const {
      detail: { latitude, longitude },
    } = e;

    if (!latitude || !longitude) {
      return;
    }

    this.latitude = latitude;
    this.longitude = longitude;
  }
}

customElements.define('search-view', SearchView);
