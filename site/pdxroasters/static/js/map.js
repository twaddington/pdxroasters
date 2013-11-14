define(['Leaflet', 'jquery' ], function (L, $) {

  var zoom = 13;
  var $body = $('body');
  var isHome = $body.hasClass('home');
  var map;

  if (isHome){
    map = L.map('map', {
        center: [45.52, -122.67],
        zoom: zoom,
        scrollWheelZoom: false,
        attributionControl: false
    });
  }

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

  if (isHome){
    var $list      = $('#list');
    var $distance  = $('#distance');
  }

  console.log(isHome);

  var Map = {
    init: function() {
      if (isHome) {
        L.tileLayer('http://{s}.tiles.mapbox.com/v3/financialtimes.map-w7l4lfi8/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
        }).addTo(map);
      }
    },
    addMarker: function(lat, lng, popup) {
      L.marker([lat, lng], {icon: roasterMarker}).addTo(map).bindPopup(popup);
    },
    addPopUp: function(name, slug) {
      var popup = '<h5><a href="roaster/' + slug + '">' + name + '<span class="right-arrow"></span></a></h5>';
      return popup;
    },
    roasters: null,
    getRoasters: function() {
      $.getJSON("/api/roaster/?format=jsonp&callback=?", {limit: 200}, function(data){
        //console.log(data.objects);

        Map.roasters = data.objects;
        Map.parseList();

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
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);

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
    location: null,
    locationFound: function(e){
      Map.location = e;
      Map.parseList();
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
        map.panTo(e.latlng);
      }
    },
    setupList: function() {
      if (isHome){
        $list.find('.roaster').each(function(){
          var $this = $(this);
          var letter = $this.data('name').charAt(0);
          $this.find('.letter').html(letter);
        });
      }
    },
    parseList: function(){

      function rank(a,b){
        if (a.distance > b.distance){ return 1; }
        if (a.distance < b.distance){ return -1; }
        return 0;
      }

      if (Map.roasters && Map.location){
        var roasters = [];

        for (var i = 0; i < Map.roasters.length; i++){
          var roaster = Map.roasters[i];
          if (roaster.lat && roaster.lng){
            var latlng = new L.LatLng(roaster.lat, roaster.lng);
            var distance = latlng.distanceTo(Map.location.latlng) * 0.000621371;
            roaster.distance = parseFloat(distance.toFixed(2));
            roasters.push(roaster);
          }
        }

        roasters.sort(rank);
        var $distance = $('#distance');
        var text = '';

        for (var j = 0; j < roasters.length; j++){
          text += '<li class="roaster"><div class="distance"><span class="letter">' + roasters[j].distance + '<br>miles</span></div><a href="/roaster/' + roasters[j].slug + '/" class="handle"><span class="list-name">' + roasters[j].name + '</span><span class="address">' + roasters[j].address + '</span></a></li>';
        }

        $distance.html(text);
      }

    },
    toggleList: function(){
      var $nameLink     = $('#by-name');
      var $distance     = $('#distance');
      var $alpha        = $('#roasters');
      var $distanceLink = $('#by-distance');


      $distanceLink.click(function(e) {
        e.preventDefault();

        if (!Map.location ){
          Map.locate();
        }

        $distanceLink.addClass('active');
        $nameLink.removeClass('active');
        $alpha.addClass('hidden');
        $distance.removeClass('hidden');
      });

      $nameLink.click(function(e) {
        e.preventDefault();
        $nameLink.addClass('active');
        $distanceLink.removeClass('active');
        $distance.addClass('hidden');
        $alpha.removeClass('hidden');
      });
    }
  };

  return Map;

});
