/**
 * PDX Roaster Mapping Javascript
 *
 * @dependencies:
 * http://maps.google.com/maps/api/js?sensor=false
 * /static/js/ender/*
 * /static/js/pdx.js
 *
 * @see:
 * https://developers.google.com/maps/documentation/javascript/reference
 *
 */
(function ( window, undefined ) {

// Closure global vars
var geocoder = new google.maps.Geocoder();

// Map namespace
window.pdx.maps = {};

/**
 * Extendable Overlay Class for google.maps
 * Following the Class inheritance example by @resig:
 * http://ejohn.org/blog/simple-javascript-inheritance/
 *
 * The google.maps.OverlayView Class has these methods:
 *
 * bindTo
 * changed
 * get
 * getMap
 * getPanes
 * getProjection
 * map_changed
 * notify
 * set
 * setMap
 * setOptions
 * setValues
 * unbind
 * unbindAll
 *
 */
(function () {
// Create the dummy Class
var Overlay = function () {};

// Set this Classes prototype to an instance of OverlayView
Overlay.prototype = new google.maps.OverlayView();

// Give Overlay an extend method
Overlay.extend = function ( prop ) {
	var prototype = new this();
	
	for ( var name in prop ) {
		if ( !prototype[ name ] ) {
			prototype[ name ] = prop[ name ];
		}
	}
	
	// Dummy constructor, use init method
	function Overlay() {
		if ( this.init ) {
			this.init.apply( this, arguments );
		}
	}
	
	Overlay.prototype = prototype;
	Overlay.prototype.constructor = Overlay;
	Overlay.extend = arguments.callee;
	
	return Overlay;
};

// Expose Overlay
window.pdx.maps.Overlay = Overlay;
})();

// Marker Class
window.pdx.maps.Marker = window.pdx.maps.Overlay.extend({
    init: function ( options ) {
        if ( !options || !options.latLng || !options.map ) {
        	console.log( "[Marker requires latLng and map]" );
        	
        	return false;
        }
        
        this.element = document.createElement( "div" );
        this.loaded = false;
        
        for ( var prop in options ) {
        	this[ prop ] = options[ prop ];
        }
        
        this.setMap( this.map );
    },
    
    onAdd: function () {
        var self = this;
        
        // Build marker html
        this.element.style.position = "absolute";
        this.element.className = "marker-custom";
        this.element.innerHTML = "<div><div></div></div>";
        this.tooltip = document.createElement( "span" );
        this.tooltip.className = "tooltip";
        this.tooltip.innerHTML = "<div>"+this.name+"</div>";
        this.loader = document.createElement( "span" );
        this.loader.className = "plus-spinner";
        this.loader.innerHTML = "<div></div>";
        this.element.appendChild( this.tooltip );
        this.element.appendChild( this.loader );
        this.getPanes().overlayMouseTarget.appendChild( this.element );
        
        // Open to custom marker actions
        if ( this.onAddCallback && typeof this.onAddCallback === "function" ) {
        	this.onAddCallback( this );
        }
    },
    
    draw: function () {
        var pixelPosition = this.getProjection().fromLatLngToDivPixel( this.latLng );
        
        if ( !pixelPosition ) {
        	console.log( "[Marker failed]" );
        	
        	return false;
        }
        
        this.tooltip.style.left = -((this.tooltip.clientWidth/2)-(this.element.clientWidth/2))+"px";
        this.loader.style.left = -((this.loader.clientWidth/2)-(this.element.clientWidth/2))+"px";
        this.loader.style.top = -(this.loader.clientHeight+3)+"px";
        this.element.style.left = (pixelPosition.x-(this.element.clientWidth/2))+"px";
        this.element.style.top = (pixelPosition.y-(this.element.clientHeight))+"px";
        this.element.style.zIndex = 999;
        this.element.parentNode.style.zIndex = 999;
    },
    
    setPosition: function ( position ) {
        if ( !this.element ) {
			return false;
		}
		
		this.latLng = position;
		this.draw();
		
		return true;
    },
    
    getPosition: function () {
        if ( !this.element ) {
			return null;
		}
		
		return this.latLng;
    },
    
    onRemove: function () {
        if ( !this.element ) {
			return false;
		}
		
		this.element.parentNode.removeChild( this.element );
		
		return true;
    },
    
    remove: function () {
        if ( !this.element ) {
			return;
		}
		
		this.element.parentNode.removeChild( this.element );
		this.element = null;
    }
});

// Geocoding helper
// data is either {latLng:google.maps.LatLng} OR {address:""}
window.pdx.maps.geocode = function ( data, callback ) {
	geocoder.geocode( data, function ( results, status ) {
		if ( status !== google.maps.GeocoderStatus.OK ) {
			return;
		}
		
		if ( typeof callback === "function" ) {
			callback( results[ 0 ].geometry.location, results[ 0 ] );
		}
	});
}

})( window );