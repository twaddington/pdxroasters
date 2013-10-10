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
require(['map', 'forms', 'scroll', 'Leaflet', 'jquery'], function(Map, Forms, Scroll, L, $){

  Map.init();
  Map.setupList();
  Map.getRoasters();
  Map.locate();
  Map.toggleList();

  Scroll.init();
  Scroll.updateActive();
  Scroll.smoothScroll();

  Forms.validate();

});