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

export { canGeolocate, detectUserLocation };
