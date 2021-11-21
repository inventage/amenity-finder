const DEFAULT_BASE_URL = 'https://overpass-api.de/api';

/**
 * @see https://wiki.openstreetmap.org/wiki/Key:amenity
 * @type {{parking: {label: string, type: string}, toilets: {label: string, type: string}, postBox: {label: string, type: string}, fuel: {label: string, type: string}, restaurant: {label: string, type: string}, drinkingWater: {label: string, type: string}, bicycleRental: {label: string, type: string}, busStation: {label: string, type: string}, atm: {label: string, type: string}, carWash: {label: string, type: string}}}
 */
export const OSM_AMENITY_TYPES = {
  restaurant: {
    label: 'Restaurant',
    type: 'restaurant',
  },
  parking: {
    label: 'Parking',
    type: 'parking',
  },
  drinkingWater: {
    label: 'Drinking Water',
    type: 'drinking_water',
  },
  bicycleRental: {
    label: 'Bicycle Rental',
    type: 'bicycle_rental',
  },
  busStation: {
    label: 'Bus Station',
    type: 'bus_station',
  },
  carWash: {
    label: 'Car Wash',
    type: 'car_wash',
  },
  fuel: {
    label: 'Fuel',
    type: 'fuel',
  },
  atm: {
    label: 'ATM',
    type: 'atm',
  },
  postBox: {
    label: 'Post Box',
    type: 'post_box',
  },
  toilets: {
    label: 'Toilets',
    type: 'toilets',
  },
};

export const DEFAULT_AMENITY_TYPE = OSM_AMENITY_TYPES.restaurant;

/**
 * Overpass API class
 *
 * @see https://overpass.osm.ch/
 * @see https://wiki.openstreetmap.org/wiki/Overpass_API
 */
export class OverpassApi {
  constructor(baseUrl = DEFAULT_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async getNodeByLatLng(lat, lng, radius, type = DEFAULT_AMENITY_TYPE.type) {
    const query = `
      [out:json];
      (
      node["amenity"="${type}"](around:${radius},${lat},${lng});
      );
      out;
    `;

    const targetUrl = new URL(`${this.baseUrl}/interpreter`);
    targetUrl.searchParams.append('data', query);

    const response = await fetch(targetUrl.href);
    const jsonResponse = await response.json();

    const { elements } = jsonResponse;
    if (!elements) {
      return [];
    }

    return elements;
  }
}
