/**
 * PDX Roaster Application Contoller
 *
 * @dependencies:
 * /static/js/pdx.js
 * /static/js/controllers/*
 *
 */
(function ( $, window ) {

"use strict";

var $docBody = $( document.body ),
	docData = $docBody.data();

// Get all data into pdx namespace
for ( var i in docData ) {
	window.pdx[ i ] = docData[ i ];
}

// Run the controller
window.pdx.exec( docData.controller );

})( ender, window );