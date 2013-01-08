/**
 * Ender Utilities
 *
 * @dependencies:
 * /static/js/ender/ender.js
 *
 */
(function ( $ ) {

// Easing taken from jQuery core
$.easing = {
	linear: function ( p ) {
		return p;
	},
	
	swing: function ( p ) {
		return 0.5-Math.cos( p*Math.PI )/2;
	}
};

// indexOf support for Array.prototype
$.indexOf = function ( arr, item ) {
    if ( ![].indexOf ) {
		var len = arr.length;
		
		for ( var i = 0; i < len; i++ ) {
			if ( arr[ i ] === item ) {
				return i;
			}
		}
	
		return -1;
	
	} else {
		return arr.indexOf( item );
	}
};

// Ender smooth scroll utility with ender-tween
// $.tween( duration, from, to, tween, ease )
$.fn.scrollTo = function ( dur ) {
    var dest = this.offset().top,
        cb = function ( to ) {
            window.scrollTo( 0, to );
        };
    
    // Don't default to Ender's 1000ms duration
    dur = dur || 400;
    
    $.tween( dur, 0, dest, cb, $.easing.swing );
};

// Turn Ender set into Array
$.fn.toArray = function () {
    var arr = [];
    
    this.each(function () {
        arr.push( this );
    });
    
    return arr;
};

// Simple compat for jQuery.fn.index()
$.fn.index = function () {
    var $matches = this.parent().children();
    
    return $.indexOf( $matches.toArray(), this[ 0 ] );
};

// Simple compat for jQuery.fn.push()
$.fn.push = function ( elem ) {
    return this[ this.length-1 ] = elem;
};

// Simple compat for jQuery.fn.add()
// Because this needs to return a new set
$.fn.add = function ( mixed ) {
    var add,
        set = this.toArray();
    
    // Selector or DOMElement
    if ( typeof mixed === "string" || (mixed.nodeType && mixed.nodeType === 1) ) {
    	add = $( mixed );
    
    // HTMLCollection or Ender set	
    } else if ( mixed.length ) {
        add = mixed;
        
    } else {
        console.log( "something else" );
    }
    
    for ( var i = 0, len = add.length; i < len; i++ ) {
    	set.push( add[ i ] );
    }
    
    return $( set );
};

})( ender );