/**
 * PDX Roaster Application Contoller
 *
 * @dependencies:
 * /static/js/ender/*
 * /static/js/pdx.js
 * /static/js/lib/*
 *
 */
(function ( window ) {

"use strict";

// Run controller
var controller = $( document.body ).data( "controller" );

if ( window.pdx.app[ controller ] && window.pdx.app[ controller ].init ) {
	window.pdx.app[ controller ].init();
}

})( window );