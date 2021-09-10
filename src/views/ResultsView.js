import { html, LitElement } from 'lit';

import { OverpassApi } from '../services/OverpassApi.js';

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
      ${this.results.map(result => this._resultTemplate(result))}
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  _resultTemplate(result) {
    const {
      lat,
      lon,
      id,
      tags: { name },
    } = result;

    return html`<p>
      ${id}, ${lat}, ${lon}<br />
      ${name}
    </p> `;
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
