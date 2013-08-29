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
require(['map', 'forms', 'Leaflet', 'jquery'], function(Map, Forms, L, $){
  Map.init();
  Map.getRoasters();
  Map.locate();

  Forms.validate();

});