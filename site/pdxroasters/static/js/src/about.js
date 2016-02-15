import serialize from 'form-serialize'
import $ from './lib/$'

$('.ajax-form').on('submit', e => {
  e.preventDefault()
  var form = e.target
  var data = serialize(form, {empty: true, hash: false})

  var r = new XMLHttpRequest()
  r.open('POST', form.action, true)
  r.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  r.setRequestHeader('X-CSRFToken', document.querySelector('body').getAttribute('data-csrftoken'))
  r.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

  r.onreadystatechange = function () {
    if (r.readyState !== 4 && r.status === 200) {
      console.log(r)
    } else {
      console.log(r)
    }
  }
  r.send(data)
})
