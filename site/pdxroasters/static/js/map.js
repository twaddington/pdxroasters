define(["Leaflet"], function (L) {

  var zoom = 13;

  var map = L.map('map', {
      center: [45.52, -122.67],
      zoom: zoom,
      scrollWheelZoom: false,
      attributionControl: false
  });

  var roasterMarker = L.icon({
    iconUrl: '/static/img/roaster-marker-sans.png',
    iconRetinaUrl: '/static/img/roaster-marker-sans@2x.png',
    iconSize: [20, 34],
    iconAnchor: [10, 30],
    popupAnchor: [0, -34],
    shadowUrl: '/static/img/shadow@2x.png',
    shadowRetinaUrl: '/static/img/shadow@2x.png',
    shadowSize: [18, 10],
    shadowAnchor: [9, 5]
  });

  var Map = {
    init: function() {
      L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
      }).addTo(map);
    },
    addMarker: function(lat, lng, popup) {
      L.marker([lat, lng], {icon: roasterMarker}).addTo(map).bindPopup(popup);
    },
    addPopUp: function(name, slug) {
      var popup = '<h5><a href="/roaster/' + slug + '">' + name + '<span class="right-arrow"></span></a></h5>';
      return popup;
    },
    getRoasters: function() {
      $.getJSON("/api/roaster/?format=json", function(data){
        //console.log(data.objects);
        for (var i = 0; i < data.objects.length; i++){

          var d = data.objects[i];

          if (d.lat && d.lng){
            var popup = Map.addPopUp(d.name, d.slug);
            Map.addMarker(d.lat, d.lng, popup);
          } else {
            console.log("latitude and longitude not available for:" + d.name);
          }
        }
      }).error(function(jqXHR, textStatus, errorThrown){
        console.log("Error fetching roaster json");
      });
    },
    locate: function() {
      map.locate({
        setView: false,
        maxZoom: 12,
        watch: false
      });
      var counter = 0;

      map.on('locationfound', Map.locationFound);

    },
    locationFound: function(e){

      // if the device is in portland, center and show device location
      if (e.latitude > 45.49 && e.latitude < 45.53 && e.longitude > -122.8 && e.longitude < -122.4){
        var deviceMarker = L.icon({
          iconUrl: '/static/img/device.png',
          iconRetinaUrl: '/static/img/device@2x.png',
          iconSize: [10, 10],
          iconAnchor: [5, 5]
        });
        var device = {
          "color": "#4DAEFF",
          "stroke": true,
          "fill": "#ffffff",
          "weight": 1,
          "opacity": 1
        };
        L.circle(e.latlng, 120, device).addTo(map);
        L.marker(e.latlng, {icon: deviceMarker}).addTo(map);
        map.setView(e.latlng, zoom + 1);
      }

      return;

    }
  };

  return Map;

});