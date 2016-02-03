/**
 * Make the correct link active in top nav and scroll to correct section
 */
import scroll from '../lib/scroll'
import $ from '../lib/$'

$('js-nav-anchor').on('click', e => {
  e.preventDefault()
  history.pushState({}, '', this.href)
  scroll.to(document.getElementById(e.target.dataset.scrollTo))
})

scroll.on(e => {
  let win = document.documentElement.scrollTop || document.body.scrollTop
  let listOffset = document.querySelector('.js-list').offsetTop
  if (win > listOffset - height / 2) {
    history.replaceState({page: "list"}, "List", "/#list")
  }
  if (win < listOffset - height / 2 && listActive === true){
    history.replaceState({page: "list"}, "List", "/#list")
  }
})

window.addEventListener('hashchange', e => {
  $('.js-nav-anchor').removeClass('active')
  if (location.hash === '#list') {
    $('.js-list-anchor').addClass('active')
  } else {
    $('js-map-anchor').addClass('active')
  }
})
