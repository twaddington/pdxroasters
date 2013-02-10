/**
 * PDX Roaster Sitewide Javascript
 *
 * @dependencies:
 * /static/js/pdx.js
 *
 */
(function ( $, window, undefined ) {

"use strict";

// Smooth scroll links
$( ".scroll-to" ).on( "click", function ( e ) {
    e.preventDefault();
    
    var $elem = $( this.hash );
    
    $.scrollTo( $elem.offset().top );
});

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