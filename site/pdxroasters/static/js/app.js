/**
 * PDX Roaster Application Contoller
 *
 * @dependencies:
 * /static/js/ender/*
 * /static/js/pdx.js
 * /static/js/lib/*
 *
 */
(function ( $, window ) {

"use strict";

// Establish environment
window.pdx.environment = $( document.body ).data( "environment" );

// Run controller
var controller = $( document.body ).data( "controller" );

if ( window.pdx.app[ controller ] && window.pdx.app[ controller ].init ) {
	window.pdx.app[ controller ].init();
}

})( ender, window );