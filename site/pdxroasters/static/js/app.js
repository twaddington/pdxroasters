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

var $docBody = $( document.body ),
	docData = $docBody.data();

// Get all data into pdx namespace
for ( var i in docData ) {
	window.pdx[ i ] = docData[ i ];
}

if ( docData.controller && window.pdx.app[ docData.controller ] && window.pdx.app[ docData.controller ].init ) {
	window.pdx.app[ docData.controller ].init();
}

})( ender, window );