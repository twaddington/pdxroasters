import $ from '../lib/$'
import L from 'leaflet'

$('.js-list-toggle').on('click', e => {
  e.preventDefault()
  $('.js-list-toggle').removeClass('active')
  $('.js-list-content').addClass('hidden')
  $(e.target).addClass('active')
  $(`.js-${e.target.dataset.sort}-list`).removeClass('hidden')
})

function distance (roaster, location) {
  var latlng = new L.LatLng(parseFloat(a.dataset.lng), parseFloat(a.dataset.lng))
  var distance = latlng.distanceTo(location.latlng) * 0.000621371
  roaster.distance = parseFloat(distance.toFixed(2))
}

function sortDistanceList (location) {
  let list = $('.js-by-distance-item')
    .sort((a,b) => distance(a, location) - distance(b, location))
    .map(el => el.outerHTML)
    .join('')
  document.querySelector('.js-distance-list').innerHTML = list
}

let roasters = $('.js-by-name-item').map(el => el.dataset)

export default {
  roasters,
  sortDistanceList
}
