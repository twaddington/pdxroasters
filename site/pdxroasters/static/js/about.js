import $ from ('./lib/$')

$('.ajax-form').on('submit', e => {
  e.preventDefault()

  var $this = $( this ),
    form = $this.data( "form" );

  var csrf = document.querySelector('body').dataset.csrftoken
  // TODO find some cool way to post without jquery (on npm)
  // $.ajax({
  //   data: $this.serialize(),
  //   headers: {
  //     "X-CSRFToken": csrf
  //   },
  //   method: post,
  //   type: "json",
  //   url: this.action
  // })
  // .then(function ( response ) {
  //   if ( response.status === 204 ) {
  //     console.log("success");

  //   } else {
  //     console.log("fail");
  //   }
  // })
  // .fail(function (  error, message  ) {
  //   console.log("seriously, you failed.");
  // });
})
