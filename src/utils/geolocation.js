import LatLon from 'geodesy/latlon-ellipsoidal-vincenty';

/**
 * Returns true if the current agent supports geolocation.
 *
 * @returns {boolean}
 */
const canGeolocate = () => 'geolocation' in navigator;

/**
 * Function to detect a user's location, promise based.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API
 *
 * @returns {Promise<unknown>}
 */
const detectUserLocation = () =>
  new Promise((resolve, reject) => {
    if (!canGeolocate()) {
      reject(new Error('Geolocation not possible'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      error => reject(error)
    );
  });

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

  return p1.distanceTo(p2);
};

export { canGeolocate, detectUserLocation, distanceBetween };
