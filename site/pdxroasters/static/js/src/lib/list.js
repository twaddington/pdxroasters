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
  var latlng = new L.LatLng(parseFloat(roaster.dataset.lat), parseFloat(roaster.dataset.lng))
  var distance = latlng.distanceTo(location.latlng) * 0.000621371
  return parseFloat(distance.toFixed(2))
}

export function sortDistanceList (location) {
  let list = $('.js-by-distance-item')
    .filter(roaster => roaster.dataset.lat && roaster.dataset.lng)
    .map(roaster => {
      roaster.dataset.distance = distance(roaster, location)
      roaster.querySelector('.distance').innerHTML = `<span class="letter">${roaster.dataset.distance}</span>`
      $(roaster).removeClass('greyed-out')
      return roaster
    })
    .sort((a,b) => a.dataset.distance - b.dataset.distance)
    .map(el => el.outerHTML)
    .join('')
  document.querySelector('.js-distance-list').innerHTML = list
}

export let roasters = $('.js-by-name-item').map(el => {
  return {
    name: el.getAttribute('data-name'),
    lat: el.getAttribute('data-lat'),
    lng: el.getAttribute('data-lng'),
    slug: el.getAttribute('data-slug'),
    id: el.getAttribute('data-id'),
    address: el.getAttribute('data-address')
  }
})
