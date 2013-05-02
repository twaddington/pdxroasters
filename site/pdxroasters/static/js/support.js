/**
 * PDX Roaster Mobile detection Javascript
 *
 */
(function ( window, undefined ) {

"use strict";

window.pdx.support = {};

var _userAgent = navigator.userAgent.toLowerCase();

window.pdx.support.mobile = function () {
    var regex = /android|iphone|ipad|ipod/,
    	match = regex.exec( _userAgent ),
    	ret = {
	        device: ( match && match.length ) ? match[ 0 ] : null,
	        isMobile: regex.test( _userAgent )
	    };
	
	return ret;
};

window.pdx.support.geolocation = function () {
	return ( "geolocation" in navigator ) ? true : false;
};

// Hide the address bar
setTimeout(function () {
	window.scrollTo( 0, 1 );
				
}, 100 );

})( window );