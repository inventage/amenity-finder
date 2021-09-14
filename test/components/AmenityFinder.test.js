import { fixture, expect, waitUntil } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import '../../src/AmenityFinder.js';

describe('<amenity-finder>', () => {
  describe('Structure', () => {
    it('has a rendered attribute', async () => {
      const el = await fixture(html`<amenity-finder></amenity-finder>`);
      await waitUntil(() => el.shadowRoot.querySelector('mwc-drawer'), '<amenity-finder> did not render children');
      expect(el).to.have.attribute('rendered');
    });
  });

  describe('Accessibility', () => {
    it('is displayed by default', async () => {
      const el = await fixture(html`<amenity-finder></amenity-finder>`);
      expect(el).to.be.displayed;
    });

    it.skip('is accessible', async () => {
      const el = await fixture(html`<amenity-finder></amenity-finder>`);
      await expect(el).to.be.accessible();
    });

    it('is hidden when attribute hidden is true', async () => {
      const el = await fixture(html`<amenity-finder hidden></amenity-finder>`);
      expect(el).not.to.be.displayed;
    });
  });
});
