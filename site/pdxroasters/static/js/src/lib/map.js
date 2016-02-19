import L from 'leaflet'

var map = L.map('map', {
  center: [45.52, -122.67],
  zoom: 13,
  scrollWheelZoom: false,
  attributionControl: false
})

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
})

var deviceMarker = L.icon({
  iconUrl: '/static/img/device.png',
  iconRetinaUrl: '/static/img/device@2x.png',
  iconSize: [10, 10],
  iconAnchor: [5, 5]
})

var deviceCircle = {
  "color": "#4DAEFF",
  "stroke": true,
  "fill": "#ffffff",
  "weight": 1,
  "opacity": 1
}

L.tileLayer('http://{s}.tiles.mapbox.com/v3/financialtimes.map-w7l4lfi8/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: `Map data &copy;
                <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,
                <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,
                Imagery © <a href="http://cloudmade.com">CloudMade</a>`
}).addTo(map)

function addRoaster (r) {
  if (r.lat && r.lng) {
    var popup = `<h5><a href="roaster/${r.slug}">${r.name}<span class="right-arrow"></span></a></h5>`
    L.marker([r.lat, r.lng], {icon: roasterMarker}).addTo(map).bindPopup(popup)
  } else {
    console.log(`latitude and longitude not available for: ${r.name}`)
  }
}

map.locate({
  setView: false,
  maxZoom: 12,
  watch: false
})

map.on('locationfound', e => {
  // if the device is in portland, center and show device location
  if (e.latitude > 45.2 && e.latitude < 45.9 && e.longitude > -123.1 && e.longitude < -122.4){
    L.circle(e.latlng, 120, deviceCircle).addTo(map);
    L.marker(e.latlng, {icon: deviceMarker}).addTo(map);
    map.panTo(e.latlng);
  }
})

export let addRoasters = arr => arr.forEach(addRoaster)
export let locationFound = cb => map.on('locationfound', cb)
