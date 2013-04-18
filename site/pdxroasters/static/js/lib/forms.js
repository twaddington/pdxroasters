/**
 * PDX Roaster Form handling
 *
 * @dependencies:
 * /static/js/pdx.js
 *
 */
(function ( $, window ) {

"use strict";

var _addRoasterSuccess = "Thank you for reminding us how much we suck at research. We'll get this roaster added soon!",
	_contactSuccess = "Thank you for the note. We'll get back to you soon.";

// Forms namespace
window.pdx.forms = {
	done: function ( $elem ) {
		var $thanks = $( "<p>"+_addRoasterSuccess+"</p>" ),
			timeout;
		
		$elem.hide();
		
		$thanks.insertBefore( $elem );
		
		$elem.find( "[name]" ).val( "" );
		
		timeout = setTimeout(function () {
			clearTimeout( timeout );
			
			$thanks.remove();
			
			$elem.show();
			
		}, 5000 );
	},
	
	fail: function ( $elem, response ) {
		$elem.find( ".error-message" ).remove();
		
		var $field = $elem.find( "[name='"+response.field+"']" );
		
		$field.addClass( "f-error" ).focus();
		
		$( '<span class="error-message">'+response.error+'</span>' ).insertBefore( $field );
	}
};

// Async form handling
$( ".ajax-form" ).on( "submit", function ( e ) {
    e.preventDefault();
    
    var	$this = $( this ),
    	form = $this.data( "form" );
    
    $.ajax({
    	data: $this.serialize(),
    	headers: {
	    	"X-CSRFToken": window.pdx.csrftoken
    	},
        method: this.method,
        type: "json",
        url: this.action
    })
    .then(function ( response ) {
	    if ( response.status === 204 ) {
        	window.pdx.forms.done( $this );
        	
        } else {
	        window.pdx.forms.fail( $this, response );
        }
    })
    .fail(function (  error, message  ) {
	    window.pdx.forms.fail( $this, error );
    });
});

})( ender, window );