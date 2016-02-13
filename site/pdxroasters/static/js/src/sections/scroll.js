/**
 * Make the correct link active in top nav and scroll to correct section
 */
import scrollTo from 'smoothscroll'
import onScroll from 'do-something-on-scroll'
import $ from '../lib/$'

let anchor = $('.js-nav-anchor')
let listAnchor = $('.js-list-anchor')
let mapAnchor = $('.js-map-anchor')

anchor.on('click', e => {
  e.preventDefault()
  scrollTo(document.getElementById(e.target.dataset.scrollTo))
})

function update () {
  let win = document.documentElement.scrollTop || document.body.scrollTop
  let listOffset = document.querySelector('.js-list').offsetTop
  anchor.removeClass('active')
  if (win > listOffset - window.innerHeight / 2) {
    history.replaceState({page: "list"}, "List", "/#list")
    listAnchor.addClass('active')
  }
  if (win < listOffset - window.innerHeight / 2) {
    history.replaceState({page: "map"}, "Map", "/")
    mapAnchor.addClass('active')
  }
}

onScroll(update)
update()
