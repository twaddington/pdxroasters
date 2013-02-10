/**
 * PDX Roaster Sitewide Javascript
 *
 * @dependencies:
 * /static/js/ender/*
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
    	form = $this.data( "form" ),
    	csrftoken = $this.find( "[name='csrfmiddlewaretoken']" ).val();
    
    $.ajax({
    	data: $this.serialize(),
    	headers: {
	    	"X-CSRFToken": csrftoken
    	},
        method: this.method,
        type: "json",
        url: this.action,
        success: function ( response ) {
	        if ( window.pdx.forms[ form ] && typeof window.pdx.forms[ form ].done === "function" ) {
	        	window.pdx.forms[ form ].done( $this, response );
	        }
        },
        error: function ( error ) {
	        if ( window.pdx.forms[ form ] && typeof window.pdx.forms[ form ].fail === "function" ) {
	        	window.pdx.forms[ form ].fail( $this, error );
	        }
        }
    });
});

})( ender, window );