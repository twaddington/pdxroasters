/**
 * PDX Roaster Mobile detection Javascript
 *
 */
(function ( window, undefined ) {

"use strict";

var _userAgent = navigator.userAgent.toLowerCase(),
	_getMobile = function () {
	    var regex = /android|iphone|ipad|ipod/,
	    	match = regex.exec( _userAgent ),
	    	ret = {
		        device: ( match && match.length ) ? match[ 0 ] : null,
		        isMobile: regex.test( _userAgent )
		    };
		
		return ret;
	}

window.pdx.mobile = _getMobile();

// Hide the address bar
setTimeout(function () {
	window.scrollTo( 0, 1 );
				
}, 100 );

})( window );