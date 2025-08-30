
      var map = L.map("my-map").setView([28.6139, 77.2088], 10);

      // Get your own API Key on https://myprojects.geoapify.com
      var myAPIKey = MAPS_API_KEY;

      // Retina displays require different mat tiles quality
      var isRetina = L.Browser.retina;

      var baseUrl =
        "https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey={apiKey}";
      var retinaUrl =
        "https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey={apiKey}";

      // Add map tiles layer. Set 20 as the maximal zoom and provide map data attribution.
      L.tileLayer(isRetina ? retinaUrl : baseUrl, {
        attribution:
          'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © OpenStreetMap <a href="https://www.openstreetmap.org/copyright" target="_blank">contributors</a>',
        apiKey: myAPIKey,
        maxZoom: 20,
        id: "osm-bright",
      }).addTo(map);
