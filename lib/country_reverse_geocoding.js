import countryData from "./countries.json";

/**
 * Checks if a point is contained in a polygon
 * (based on the Jordan curve theorem), for more info:
 * http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
 * @param polygon array a series of the polygon's coordinates
 * @param point object representing the point's coordinates
 * @return boolean true if the point lies within the polygon, false otherwise
 */
function pointInPolygon(polygon, point) {
  var nvert = polygon.length;
  var c = false;
  var i = 0;
  var j = 0;
  for (i = 0, j = nvert - 1; i < nvert; j = i++) {
    if (
      polygon[i][1] > point[1] != polygon[j][1] > point[1] &&
      point[0] <
        (polygon[j][0] - polygon[i][0]) *
          (point[1] - polygon[i][1]) /
          (polygon[j][1] - polygon[i][1]) +
          polygon[i][0]
    ) {
      c = !c;
    }
  }

  return c;
}

/**
 * Identify country from latitude and longitude.
 *
 * example return { id: 'AUD', code: 'AU', name: 'Australia' }
 */
function countryFromLocation({ latitude, longitude }) {
  var point = [longitude, latitude];
  var i = 0;
  var found = false;
  do {
    var country = countryData[i];
    if (country.geometry.type === "Polygon") {
      found = pointInPolygon(country.geometry.coordinates[0], point);
    } else if (country.geometry.type === "MultiPolygon") {
      var j = 0;
      do {
        found = pointInPolygon(country.geometry.coordinates[j][0], point);
        j++;
      } while (j < country.geometry.coordinates.length && !found);
    }
    i++;
  } while (i < countryData.length && !found);

  if (found) {
    return {
      id: countryData[i - 1].id,
      code: countryData[i - 1].properties.code,
      name: countryData[i - 1].properties.name,
    };
  }

  return null;
}

export default countryFromLocation;
