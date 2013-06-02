/**
 * PDX Roaster Namespace
 *
 */
(function ( $, window ) {

"use strict";

// Create our global namespace
window.pdx = {};

// Console fallback
window.console = window.console || {};
window.console.log = window.console.log || function () {};


// Support namespace
window.pdx.support = {};


// Vendor prefix
window.pdx.support.prefix = (function () {
	var vendors = [ "Webkit", "Moz", "O", "ms" ],
		prefix;
	
	for ( var i = 0, len = vendors.length; i < len; i++ ) {
		if ( document.body.style[ vendors[ i ]+"Transform" ] !== undefined ) {
			prefix = vendors[ i ];
			break;
		}
	}
	
	return prefix;
})();

// Mobile detection
window.pdx.support.mobile = (function ( ua ) {
	var regex = /android|iphone|ipad|ipod/,
		match = regex.exec( ua ),
		ret = {
			device: ( match && match.length ) ? match[ 0 ] : null,
			isMobile: regex.test( ua )
		};

	return ret;
	
})( navigator.userAgent.toLowerCase() );


if ( window.pdx.support.mobile.isMobile ) {
	$( document.body ).addClass( "mobile "+window.pdx.support.mobile.device );
	
} else {
	$( document.body ).addClass( "desktop" );
}


var docData = $( document.body ).data();
	
for ( var i in docData ) {
	window.pdx[ i ] = docData[ i ];
}

})( ender, window );