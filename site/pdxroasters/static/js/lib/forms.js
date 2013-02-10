/**
 * PDX Roaster Form handling
 *
 * @dependencies:
 * /static/js/pdx.js
 *
 */
(function ( $, window ) {

"use strict";

// Forms namespace
window.pdx.forms = {
	contact: {
		done: function ( $elem ) {
			console.log( "[pdx.forms.contact.done]" );
		},
		
		fail: function ( $elem, error ) {
			console.log( "[pdx.forms.contact.fail]: ", error );
		}
	},
	
	roaster: {
		done: function ( $elem ) {
			console.log( "[pdx.forms.roaster.done]" );
		},
		
		fail: function ( $elem, error ) {
			console.log( "[pdx.forms.roaster.fail]: ", error );
		}
	}
};

})( ender, window );