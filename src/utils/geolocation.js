import LatLon from 'geodesy/latlon-ellipsoidal-vincenty';
import { Geolocation } from '@capacitor/geolocation';

/**
 * Simple regex pattern (as string, so we can use it in the Constraint Validation API) for latitude / longitude.
 *
 * @see https://regex101.com/r/eDCQuX/1/
 *
 * @type {string}
 */
// prettier-ignore
const latLongRegexPatternString = '^-?\\d+(\\.\\d+)?$';

/**
 * Function to detect a user's location, promise based.
 *
 * @returns {Promise<import('@capacitor/geolocation').Position>}
 */
const detectUserLocation = async () => {
  const hasPermissions = await Geolocation.checkPermissions();
  if (!hasPermissions) {
    const { location } = await Geolocation.requestPermissions();
    if (location === 'denied') {
      throw new Error('Geolocation not possible');
    }
  }

  return Geolocation.getCurrentPosition();
};

/**
 * Returns the distance in meters between two [lat, lng] points.
 *
 * @param lat1
 * @param lon1
 * @param lat2
 * @param lng2
 *
 * @returns {number}
 */
const distanceBetween = ([lat1, lon1], [lat2, lng2]) => {
  const p1 = new LatLon(lat1, lon1);
  const p2 = new LatLon(lat2, lng2);

  // noinspection JSCheckFunctionSignatures
  return p1.distanceTo(p2);
};

export { detectUserLocation, distanceBetween, latLongRegexPatternString };
