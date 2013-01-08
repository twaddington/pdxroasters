/**
 * Ender Utilities
 *
 * @dependencies:
 * /static/js/ender/ender.js
 *
 */
(function ( $ ) {

// Ender smooth scroll utility with ender-tween
// $.tween( duration, from, to, tween, ease )
$.fn.scrollTo = function ( dur ) {
    var dest = this.offset().top,
        cb = function ( to ) {
            
            window.scrollTo( 0, to );
            
        };
    
    // Don't default to Ender's 1000ms duration
    dur = dur || 400;
    
    $.tween( dur, 0, dest, cb, $.easing.linear );
};

// Easing taken from jQuery core
$.easing = {
	linear: function ( p ) {
		return p;
	},
	swing: function ( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

})( ender );