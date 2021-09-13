/**
 * Comparison function comparing two objects by a given property.
 * Can be used to sort array items by a dynamic property.
 *
 * @param a
 * @param b
 * @param property {String}
 *
 * @returns {number}
 */
export const compareByProperty = (a, b, property) => {
  if (!(property in a) || !(property in b)) {
    return 0;
  }

  if (a[property] < b[property]) {
    return -1;
  }

  if (a[property] > b[property]) {
    return 1;
  }

  return 0;
};

/**
 * Formats the given distance in meters into a string with proper thousands separator,
 * adding the km unit for distances greater than 1000.
 *
 * @param distance
 * @param fractionDigits
 * @param locale
 * @returns {string|*}
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
 */
export const formatDistance = (distance, fractionDigits = 2, locale = 'de-CH') => {
  // Loosely check whether the given distance is a number
  // This will also parse numbers from strings like `1a` (→ `1`)
  const normalizedDistance = parseInt(`${distance}`, 10);
  if (Number.isNaN(normalizedDistance)) {
    return distance;
  }

  const isKm = normalizedDistance >= 1000;

  // Webkit fails on this
  // → npx wtr test/utils/helpers.test.js --watch --playwright --browsers webkit

  // const format = new Intl.NumberFormat(locale, {
  //   style: 'unit',
  //   unit: isKm ? 'kilometer' : 'meter', // https://tc39.es/ecma402/#table-sanctioned-simple-unit-identifiers
  //   unitDisplay: 'narrow',
  //   maximumFractionDigits: fractionDigits,
  // });
  //
  // return format.format(isKm ? normalizedDistance / 1000 : normalizedDistance);

  const format = new Intl.NumberFormat(locale, {
    style: 'decimal',
    maximumFractionDigits: fractionDigits,
  });

  const number = format.format(isKm ? normalizedDistance / 1000 : normalizedDistance);
  const unit = isKm ? 'km' : 'm';

  return `${number} ${unit}`;
};

/**
 * A function resolving a promise after a given time.
 * This can be used in async functions to delay execution:
 *
 * async func() {
 *   await delay(1000);
 *   …
 * }
 *
 * @param time
 * @returns {Promise<void>}
 */
export const delay = time => new Promise(r => setTimeout(r, time));
