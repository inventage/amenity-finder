import { expect } from '@open-wc/testing';
import { formatDistance } from '../../src/utils/helpers.js';

describe('helpers', () => {
  describe('formatDistance', () => {
    it('properly formats distance', () => {
      expect(formatDistance(1)).to.equal('1 m');
      expect(formatDistance(100)).to.equal('100 m');
      expect(formatDistance(1000)).to.equal('1 km');
      expect(formatDistance(10000)).to.equal('10 km');
      expect(formatDistance(1000000)).to.equal('1’000 km');
      expect(formatDistance(1000000000)).to.equal('1’000’000 km');
      expect(formatDistance('100')).to.equal('100 m');
      expect(formatDistance('100.00')).to.equal('100 m');
      expect(formatDistance('100000.00')).to.equal('100 km');
    });

    it('properly rounds uneven distances', () => {
      expect(formatDistance(1200)).to.equal('1.2 km');
      expect(formatDistance(2450)).to.equal('2.45 km');
      expect(formatDistance(2455)).to.equal('2.46 km');
      expect(formatDistance(2454)).to.equal('2.45 km');
    });

    it('ignores invalid input', () => {
      expect(formatDistance(undefined)).to.equal(undefined);
      expect(formatDistance(null)).to.equal(null);
      expect(formatDistance('abc')).to.equal('abc');
    });
  });
});
