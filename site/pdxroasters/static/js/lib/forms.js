/**
 * PDX Roaster Form handling
 *
 * @dependencies:
 * /static/js/pdx.js
 *
 */
(function ( $, window ) {

"use strict";

// Forms namespace
window.pdx.forms = {
	contact: {
		done: function ( $elem ) {
			console.log( "[pdx.forms.contact.done]" );
		},
		
		fail: function ( $elem, error ) {
			console.log( "[pdx.forms.contact.fail]: ", error );
		}
	},
	
	roaster: {
		done: function ( $elem ) {
			console.log( "[pdx.forms.roaster.done]" );
		},
		
		fail: function ( $elem, error ) {
			console.log( "[pdx.forms.roaster.fail]: ", error );
		}
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
        url: this.action,
        success: function ( response ) {
	        if ( response.status === 204 ) {
	        	window.pdx.forms[ form ].done( $this );
	        	
	        } else {
		        window.pdx.forms[ form ].fail( $this, response.error || response );
	        }
        },
        error: function ( error ) {
	        window.pdx.forms[ form ].fail( $this, error );
        }
    });
});

})( ender, window );