import serialize from 'form-serialize'
import $ from './lib/$'

$('.ajax-form').on('submit', formHandler)

function formHandler (e) {
  e.preventDefault()

  // clear any previous form errors
  $('.js-form-input').removeClass('input-error')
  $('.js-alert').addClass('hide').removeClass('alert-error')

  var form = e.target
  var data = serialize(form, {empty: true, hash: false})

  // open a new POST request to the form endpoint
  var r = new XMLHttpRequest()
  r.open('POST', form.action, true)
  r.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  r.setRequestHeader('X-CSRFToken', document.querySelector('body').getAttribute('data-csrftoken'))
  r.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
  r.onload = () => {
    // server returns 204 No Content for success, so a reponse body means error
    if (r.response) {
      var response = JSON.parse(r.response)
      var errorObject = response[0] || response
      showError(errorObject, form)
    } else {
      showSuccess(form)
    }
  }
  r.onerror = () => showError({error: `XMLHttpRequest Error: ${r.statusText}`})
  r.send(data)
}

function showError (response, form) {
  var input = form.querySelector(`[name="${response.field}"]`)
  var alert = form.querySelector('.js-alert')
  if (input) {
    input.classList.add('input-error')
  }
  alert.innerHTML = response.error
  alert.classList.add('alert-error')
  alert.classList.remove('hide')
}

function showSuccess (form) {
  var alert = form.querySelector('.js-alert')
  alert.innerHTML = 'Success! Thanks for your input!'
  alert.classList.remove('hide')
  form.reset()
}

