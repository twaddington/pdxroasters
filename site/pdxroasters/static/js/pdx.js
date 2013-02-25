/**
 * PDX Roaster Namespace
 *
 */
(function ( window ) {

"use strict";

// Console fallback
window.console = window.console || function () {};

// Create our global namespace
window.pdx = {};

// Application space
window.pdx.app = {};

// Exec method for controllers
window.pdx.exec = function ( controller ) {
	if ( window.pdx.app[ controller ] && typeof window.pdx.app[ controller ].init === "function" ) {
		window.pdx.app[ controller ].init();
	}
};

})( window );