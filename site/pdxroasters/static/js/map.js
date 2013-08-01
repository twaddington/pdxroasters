define([], function () {

  var Map = {

    init: function(_map) {
      L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
      }).addTo(_map);
    },

    addMarkers: function(_map) {
      var roasterMarker = L.icon({
        iconUrl: 'static/img/roaster-marker-sans.png',
        iconRetinaUrl: 'static/img/roaster-marker-sans@2x.png',
        iconSize: [20, 34],
        iconAnchor: [10, 30],
        popupAnchor: [0, -34],
        shadowUrl: 'static/img/shadow@2x.png',
        shadowRetinaUrl: 'static/img/shadow@2x.png',
        shadowSize: [18, 10],
        shadowAnchor: [9, 5]
      });

      L.marker([45.52, -122.67], {icon: roasterMarker}).addTo(_map)
        .bindPopup("<b>Hello world!</b><br />I am a popup.");
    }

    //var popup = L.popup();

    // function onMapClick(e) {
    //   popup
    //     .setLatLng(e.latlng)
    //     .setContent("You clicked the map at " + e.latlng.toString())
    //     .openOn(map);
    // }

    //map.on('click', onMapClick);

  }

  return Map;

});