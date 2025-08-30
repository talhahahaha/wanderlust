
const myAPIKey = window.MAPS_API_KEY;
const coords = window.LISTING_COORDS;
if (document.getElementById('my-map') && window.maplibregl) {
  var map = new window.maplibregl.Map({
    container: 'my-map',
    style: `https://maps.geoapify.com/v1/styles/osm-carto/style.json?apiKey=${myAPIKey}`,
    center: coords,
    zoom: 15
  });

  // Add marker without popup
  new window.maplibregl.Marker()
    .setLngLat(coords)
    .addTo(map);
}


