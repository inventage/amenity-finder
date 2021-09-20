import { css } from 'lit';

import { sharedStyles } from '../../common/globalStyles.js';

export default [
  sharedStyles,
  css`
    :host {
      --amenity-search-form-spacing: 1rem;

      flex: 1;
      display: flex;
      flex-direction: column;
    }

    leaflet-map {
      flex: 1;

      /* stretch to edges */
      margin-left: calc(var(--amenity-container-padding) * -1);
      margin-right: calc(var(--amenity-container-padding) * -1);
      margin-bottom: calc(var(--amenity-container-padding) * -1);
    }

    .search-header {
      padding-left: var(--safe-area-inset-left, 0);
    }

    .search-header > .form {
      margin-bottom: 1rem;
    }

    .search-form {
      display: grid;
      grid-template-rows: 1fr 1fr;
      grid-column-gap: var(--amenity-search-form-spacing);
      grid-row-gap: 0.5rem;
      align-items: center;
    }

    .search-fields {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-column-gap: var(--amenity-search-form-spacing);
    }

    .search-buttons {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-column-gap: var(--amenity-search-form-spacing);
    }

    @media (min-width: 768px) {
      .search-form {
        display: inline-grid;
        grid-template-columns: 1fr auto;
        grid-template-rows: 1fr;
      }

      .search-fields {
        grid-template-columns: repeat(3, minmax(auto, 15em));
      }

      .search-buttons {
        grid-template-columns: repeat(2, minmax(auto, 10em));
      }
    }
  `,
];
