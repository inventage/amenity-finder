import { css, html, LitElement, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

export class AmenityItem extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      distance: { type: String },
      selected: { type: Boolean },
    };
  }

  static get styles() {
    return css`
      .amenity-item {
        padding: var(--amenity-container-padding);
        border-bottom: 1px solid hsl(0, 0%, 86%);
        background-color: hsl(0, 0%, 96%);
        cursor: pointer;
        display: flex;
        justify-content: space-between;
      }

      .amenity-item > .name {
        font-size: 125%;
      }

      .amenity-item > .distance {
        color: #6a7071;
      }

      .amenity-item.-selected {
        background-color: hsl(0, 0%, 92%);
      }
      .amenity-item.-selected > .distance {
        color: #535859;
      }
    `;
  }

  constructor() {
    super();

    this.name = '';
    this.distance = '';
    this.selected = false;
  }

  render() {
    if (!this.name) {
      return nothing;
    }

    return html`<div class="amenity-item ${classMap({ '-selected': this.selected })}">
      <span class="name">${this.name}</span>
      <span class="distance">${Number.parseFloat(this.distance).toFixed(2)} m</span>
    </div>`;
  }
}

customElements.define('amenity-item', AmenityItem);
