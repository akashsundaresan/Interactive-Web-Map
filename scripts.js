// scripts.js

// Initialize the Map
var map = L.map('map').setView([33.9737, -117.3281], 13);
var openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap contributors' }).addTo(map);
var satellite = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: 'Satellite' });
var baseMaps = { "OpenStreetMap": openStreetMap, "Satellite": satellite };
var overlayMaps = {};
L.control.layers(baseMaps, overlayMaps).addTo(map);
L.Control.geocoder().addTo(map);

// Initialize the Draw Control
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    }
});
map.addControl(drawControl);

// GeoJSON Data for various locations
var ucrGeoJson = {
    "type": "Feature",
    "properties": {
        "name": "Expanded Area around UCR",
        "amenity": "University Campus",
        "popupContent": "This is an expanded area around the University of California, Riverside."
    },
    "geometry": {
        "type": "Polygon",
        "coordinates": [[[-117.3381, 33.9787], [-117.3381, 33.9687], [-117.3181, 33.9687], [-117.3181, 33.9787], [-117.3381, 33.9787]]]
    }
};
var bellagioGeoJson = {
    "type": "Feature",
    "properties": {
        "name": "Area around Bellagio",
        "amenity": "Hotel and Casino",
        "popupContent": "This area represents a vicinity around the Bellagio Hotel and Casino in Las Vegas."
    },
    "geometry": {
        "type": "Polygon",
        "coordinates": [[[-115.177, 36.113], [-115.177, 36.112], [-115.176, 36.112], [-115.176, 36.113], [-115.177, 36.113]]]
    }
};
// GeoJSON Data for Laguna Beach
var lagunaGeoJson = {
    "type": "Feature",
    "properties": {
        "name": "Area around Laguna Beach",
        "amenity": "Beach",
        "popupContent": "This area represents a vicinity around Laguna Beach."
    },
    "geometry": {
        "type": "Polygon",
        "coordinates": [
            [
                [-117.7904, 33.5477],  // Top-left corner
                [-117.7904, 33.5377],  // Bottom-left corner
                [-117.7804, 33.5377],  // Bottom-right corner
                [-117.7804, 33.5477],  // Top-right corner
                [-117.7904, 33.5477]   // Closing the polygon
            ]
        ]
    }
};

// GeoJSON Data for LAX
var laxGeoJson = {
    "type": "Feature",
    "properties": {
        "name": "Area around LAX",
        "amenity": "Airport",
        "popupContent": "This area represents a vicinity around Los Angeles International Airport (LAX)."
    },
    "geometry": {
        "type": "Polygon",
        "coordinates": [
            [
                [-118.4135, 33.9466],  // Top-left corner
                [-118.4135, 33.9366],  // Bottom-left corner
                [-118.4035, 33.9366],  // Bottom-right corner
                [-118.4035, 33.9466],  // Top-right corner
                [-118.4135, 33.9466]   // Closing the polygon
            ]
        ]
    }
};

function updateMap() {
    var place = document.getElementById('placeInput').value.trim().toLowerCase();
    map.eachLayer(function (layer) {
        if (!!layer.toGeoJSON) {
            map.removeLayer(layer);
        }
    });

    switch(place) {
        case 'ucr':
            var lat = 33.9737, lon = -117.3281;
            map.setView([lat, lon], 13);
            var ucrSpecialty = "Home to over 23,000 students and offering more than 100 undergraduate degree programs.";
            overlayMaps = { "UC Riverside": L.marker([lat, lon]).addTo(map).bindPopup("UC Riverside - " + ucrSpecialty).openPopup() };
            L.geoJSON(ucrGeoJson).addTo(map);
            displayWeatherData(lat, lon, "UC Riverside- Home to over 23,000 students and offering more than 100 undergraduate degree programs.");
            break;
        case 'bellagio':
            var lat = 36.1126, lon = -115.1767;
            map.setView([lat, lon], 13);
            var bellagioSpecialty = "Famous for its elegance, lake, and spectacular fountains.";
            overlayMaps = { "Bellagio": L.marker([lat, lon]).addTo(map).bindPopup("Bellagio Las Vegas - " + bellagioSpecialty).openPopup() };
            L.geoJSON(bellagioGeoJson).addTo(map);
            displayWeatherData(lat, lon, "Bellagio Las Vegas - Famous for its elegance, lake, and spectacular fountains.");
            break;
        case 'laguna beach':
            var lat = 33.5427, lon = -117.7854;
            map.setView([lat, lon], 13);
            var lagunaBeachSpecialty = "Known for its picturesque beaches, artistic community, and coastal parks.";
            overlayMaps = { "Laguna Beach": L.marker([lat, lon]).addTo(map).bindPopup("Laguna Beach - " + lagunaBeachSpecialty).openPopup() };
            L.geoJSON(lagunaGeoJson).addTo(map);
            displayWeatherData(lat, lon, "Laguna Beach - Known for its picturesque beaches, artistic community, and coastal parks.");
            break;
        case 'lax':
            var lat = 33.9416, lon = -118.4085;
            map.setView([lat, lon], 13);
            var laxSpecialty = "One of the busiest airports in the world, gateway to Southern California.";
            overlayMaps = { "LAX": L.marker([lat, lon]).addTo(map).bindPopup("Los Angeles International Airport (LAX) - " + laxSpecialty).openPopup() };
            L.geoJSON(laxGeoJson).addTo(map);
            displayWeatherData(lat, lon, "Los Angeles International Airport - One of the busiest airports in the world, gateway to Southern California.");
            break;
        default:
            alert("Invalid location.");
            break;
    }
    L.control.layers(baseMaps, overlayMaps).addTo(map);
}

function displayWeatherData(lat, lon, placeName) {
    var apiKey = '9a0f2072a5c71fc42872b4f90eb70603'; 
    var url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            var weatherContent = `<strong>${placeName}</strong><br>
                                Temperature: ${data.main.temp} °C<br>
                                Weather: ${data.weather[0].main}<br>
                                Wind Speed: ${data.wind.speed} m/s`;
            L.popup()
                .setLatLng([lat, lon])
                .setContent(weatherContent)
                .openOn(map);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function onMapClick(e) {
    var point = turf.point([e.latlng.lng, e.latlng.lat]);
    var buffered = turf.buffer(point, 1, { units: 'kilometers' });
    L.geoJSON(buffered, { style: function() { return { color: "#ff7800", weight: 2, opacity: 1, fillOpacity: 0.3 }; } }).addTo(map);
}
map.on('click', onMapClick);