import { html, LitElement } from 'lit';

export class SearchView extends LitElement {
  render() {
    return html`Search…`;
  }
}

customElements.define('search-view', SearchView);
