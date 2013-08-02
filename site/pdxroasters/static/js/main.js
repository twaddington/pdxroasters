require.config({
    paths: {
        'jquery':  'lib/jquery-1.10.2.min',
        'Leaflet': 'lib/leaflet'
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'Leaflet': {
            exports: 'L'
        }
    }
});

// Load modules and use them
require(['map', 'Leaflet', 'jquery'], function(Map, L, $){
    var map = L.map('map').setView([45.52, -122.67], 13);
    Map.init(map);
    Map.addMarkers(map);
});