define(["jquery"], function ($) {

  var success = "Success! We'll contact you soon!",
      csrf    = $( "body" ).data("csrftoken");

  var Forms = {
    validate: function() {
      // Async form handling
      $( ".ajax-form" ).on( "submit", function ( e ) {
        e.preventDefault();

        var $this = $( this ),
          form = $this.data( "form" );

        var csrf = $('body').attr('data-csrftoken');

        $.ajax({
          data: $this.serialize(),
          headers: {
            "X-CSRFToken": csrf
          },
          method: this.method,
          type: "json",
          url: this.action
        })
        .then(function ( response ) {
          if ( response.status === 204 ) {
            console.log("success");

          } else {
            console.log("fail");
          }
        })
        .fail(function (  error, message  ) {
          console.log("seriously, you failed.");
        });
      });
    },
  };

  return Forms;

});

