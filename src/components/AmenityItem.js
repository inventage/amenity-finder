import { css, html, LitElement, nothing } from 'lit';

export class AmenityItem extends LitElement {
  static get properties() {
    return {
      name: { type: String },
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
    `;
  }

  constructor() {
    super();

    this.name = '';
  }

  render() {
    if (!this.name) {
      return nothing;
    }

    return html`<div class="amenity-item">
      <span class="name">${this.name}</span>
    </div>`;
  }
}

customElements.define('amenity-item', AmenityItem);
