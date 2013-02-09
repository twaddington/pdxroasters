/**
 * Ender Functions as idealized from jQuery
 *
 */
(function ( $, window, undefined ) {

function _getDur( dur ) {
    return dur || 400;
}

function _getEase( ease ) {
    return ( ease && $.easing[ ease ] )
            ? $.easing[ ease ]
            : ( typeof ease === "function" )
            ? ease
            : $.easing.swing;
}

// Easing
// Add your own with $.easing.yourease = function(p){}
$.easing = {
	linear: function ( p ) {
		return p;
	},
	
	swing: function ( p ) {
		return (1-Math.cos( p*Math.PI ))/2;
	}
};

// Ender prototype functions
$.ender({
    // Turn Ender set into Array
    toArray: function () {
        var arr = [];
        
        this.each(function () {
            arr.push( this );
        });
        
        return arr;
    },
    
    // Simple compat for jQuery.fn.index()
    index: function () {
        var $matches = this.parent().children();
        
        return $.indexOf( $matches.toArray(), this[ 0 ] );
    },
    
    // Simple compat for jQuery.fn.push()
    push: function ( elem ) {
        return this[ this.length ] = elem;
    },
    
    // Simple compat for jQuery.fn.add()
    // Because this needs to return a new set
    add: function ( mixed ) {
        if ( !mixed ) {
        	return this;
        }
        
        var add,
            set = this.toArray();
        
        // Selector or DOMElement
        if ( typeof mixed === "string" || (mixed.nodeType && mixed.nodeType === 1) ) {
        	add = $( mixed );
        
        // HTMLCollection or Ender set	
        } else if ( mixed.length ) {
            add = mixed;
            
        } else {
            console.log( "add: cannot add this to ender set" );
        }
        
        for ( var i = 0, len = add.length; i < len; i++ ) {
        	set.push( add[ i ] );
        }
        
        return $( set );
    }
    
}, true );

// Ender utility functions
$.ender({
    // Ender smooth scroll utility with ender-tween
    // $.tween( duration, from, to, tween, ease )
    scrollTo: function ( to, dur, ease ) {
        var from = window.scrollY || window.pageYOffset,
            cb = function ( t ) {
                window.scrollTo( 0, t );
            };
        
        to = to || 0;
        dur = _getDur( dur );
        ease = _getEase( ease );
        
        $.tween( dur, from, to, cb, ease );
    },
    
    // indexOf support for Array.prototype
    indexOf: function ( arr, item ) {
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
    }
});

})( ender, window );