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

// Closure globals
var $document = $( document ),
    $header = $( "#header" );

// Smooth scroll links
$( ".scroll-to" ).on( "click", function ( e ) {
    e.preventDefault();
    
    var $elem = $( this.hash );
    
    $.scrollTo( $elem.offset().top );
});

// Async form handling
$( ".ajax-form" ).on( "submit", function ( e ) {
    e.preventDefault();
    
    $.ajax({
        url: this.action,
        type: "json",
        data: $( this ).serialize(),
        error: function () {
            console.log( "Ajax form error" );
        },
        success: function () {
            console.log( "Ajax form success" );
        }
    });
});

})( ender, window );