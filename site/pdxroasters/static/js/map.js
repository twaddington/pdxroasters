define(["Leaflet"], function (L) {

  var map = L.map('map').setView([45.52, -122.67], 13);

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
    }
  };

  return Map;

});