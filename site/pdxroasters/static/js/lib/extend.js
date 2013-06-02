(function ( $ ) {

var _classTypes = {},
	_classes = [
		"Boolean",
		"Number",
		"String",
		"Function",
		"Array",
		"Date",
		"RegExp",
		"Object"
	];

// Build object for class typing. Similar to jQuery's class2type
for ( var i = 0; i < _classes.length; i++ ) {
	_classTypes[ "[object "+_classes[ i ]+"]" ] = _classes[ i ].toLowerCase();
}

/******************************************************************************
 * Ender prototype extensions
*******************************************************************************/
$.ender({
	sort: function ( fn ) {
		var arr = this.toArray();
		
		return ( !arr.sort ) ? this : $(arr.sort(function ( a, b ) {
			if ( typeof fn === "function" ) {
				return fn( a, b );
			}
			
			return 0;
		}));
	},
	
	// Simple compat for jQuery.fn.toArray()
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
	add: function ( mixed ) {
		if ( !mixed ) {
			return this;
		}
		
		var set = this.toArray(),
			add;
		
		// Selector or DOMElement
		if ( typeof mixed === "string" || (mixed.nodeType && mixed.nodeType === 1) ) {
			add = $( mixed );
		
		// HTMLCollection or Ender set	
		} else if ( mixed.length ) {
			add = mixed;
		
		} else {
			console.log( "add: cannot add this to ender set" );
			return this;
		}
		
		for ( var i = 0, len = add.length; i < len; i++ ) {
			set.push( add[ i ] );
		}
		
		return $( set );
	}
	
}, true );


/******************************************************************************
 * Ender utility extensions
*******************************************************************************/
$.ender({
	easing: {
		linear: function ( p ) {
			return p;
		},
		
		swing: function ( p ) {
			return (1-Math.cos( p*Math.PI ))/2;
		}
	},
	
	tweenTo: function ( duration, from, to, tween, ease ) {
		ease = ease || function ( t ) {
			return t;
		};
		
		var time = duration || 1000,
			animDiff = to-from,
			startTime = new Date(),
			timer;
		
		function animate() {
			var diff = new Date()-startTime,
				animTo = (animDiff*ease( diff/time ))+from;
			
			if ( diff > time ) {
				tween( to );
				cancelAnimationFrame( timer );
				timer = null;
				return false;
			}
			
			tween( animTo );
			timer = requestAnimationFrame( animate );
		}
		
		animate();
	},
	
	scrollTo: function ( to, duration, ease ) {
		var from = window.scrollY || window.pageYOffset,
			cb = function ( t ) {
				window.scrollTo( 0, t );
			};
		
		to = to || 0;
		duration = duration || 400;
		ease = ease || $.easing.swing;
		
		$.tweenTo( duration, from, to, cb, ease );
	},
	
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
	},
	
	isEmptyObject: function ( obj ) {
		for ( var prop in obj ) {
			return false;
		}
		
		return true;
	},
	
	isClassType: function ( obj, type ) {
		return _classTypes[ Object.prototype.toString.call( obj ) ] === type;
	}
});

})( ender );