import { fixture, expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import '../../src/components/AmenityItem.js';

const result = {
  name: 'Some name',
  distance: '1250',
  distanceFormatted: '1.25 km',
};

describe('<amenity-item>', () => {
  describe('Structure', () => {
    it('has a .amenity-item element', async () => {
      const el = await fixture(html`<amenity-item .name="${result.name}" .distance="${result.distance}"></amenity-item>`);
      expect(el.shadowRoot.querySelector('.amenity-item')).to.exist;
    });

    it('has a .amenity-item.-selected when selected', async () => {
      const el = await fixture(html`<amenity-item .name="${result.name}" .distance="${result.distance}" .selected="${true}"></amenity-item>`);
      expect(el.shadowRoot.querySelector('.amenity-item.-selected')).to.exist;
    });

    it('renders the right HTML structure', async () => {
      const el = await fixture(html`<amenity-item .name="${result.name}" .distance="${result.distance}"></amenity-item>`);
      expect(el.shadowRoot.querySelector('.amenity-item')).dom.to.equal(`
        <div class="amenity-item">
            <span class="name">${result.name}</span>
            <span class="distance">${result.distanceFormatted}</span>
        </div>
      `);
    });
  });

  describe('Accessibility', () => {
    it('is displayed by default', async () => {
      const el = await fixture(html`<amenity-item></amenity-item>`);
      expect(el).to.be.displayed;
    });

    it('is accessible', async () => {
      const el = await fixture(html`<amenity-item .name="${result.name}" .distance="${result.distance}"></amenity-item>`);
      await expect(el).to.be.accessible();
    });

    it('is accessible when selected', async () => {
      const el = await fixture(html`<amenity-item .name="${result.name}" .distance="${result.distance}" .selected="${true}"></amenity-item>`);
      await expect(el).to.be.accessible();
    });

    it('is hidden when attribute hidden is true', async () => {
      const el = await fixture(html`<amenity-item hidden></amenity-item>`);
      expect(el).not.to.be.displayed;
    });
  });
});
