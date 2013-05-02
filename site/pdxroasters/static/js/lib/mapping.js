/**
 * PDX Roaster Mapping Javascript
 *
 * @dependencies:
 * http://maps.google.com/maps/api/js?sensor=false
 * /static/js/pdx.js
 *
 * @see:
 * https://developers.google.com/maps/documentation/javascript/reference
 *
 */
(function ( window, undefined ) {

// Don't do it for mobile
if ( window.pdx.support.mobile.isMobile ) {
	//return false;
}

// Map namespace
window.pdx.maps = {
    lib: "http://maps.google.com/maps/api/js",
    
    url: "http://maps.google.com/maps",
    
    query: {
        sensor: false,
        callback: "pdx.maps.init"
    },
    
    callbacks: [],
    
    mapsloaded: false,
    
    lazyload: function () {
        var g = document.createElement( "script" ),
            s = document.getElementsByTagName( "script" )[ 0 ];
            
            g.src = this.lib+"?"+this.parseQuery();
            g.type = "text/javascript";
            g.async = true;
            
            s.parentNode.insertBefore( g, s );
    },
    
    onmapsready: function ( fn ) {
        if ( this.mapsloaded ) {
        	console.log( "[window.pdx.maps]: mapsloaded, can't push callbacks" );
        	
        	return false;
        }
        
        this.callbacks.push( fn );
    },
    
    firemapsready: function () {
        if ( this.mapsloaded ) {
        	console.log( "[window.pdx.maps]: mapsloaded, can't fire callbacks" );
        	
        	return false;
        }
        
        for ( var i = 0, len = this.callbacks.length; i < len; i++ ) {
        	if ( typeof this.callbacks[ i ] === "function" ) {
        		this.callbacks[ i ]();
        	}
        }
    },
    
    parseQuery: function ( q ) {
        var query = q || this.query,
            ret = [];
        
        for ( var p in query ) {
            ret.push( p+"="+query[ p ] );
        }
        
        return ret.join( "&" );
    }
};

// Lazyload googlemaps
window.pdx.maps.lazyload();

// To be called when maps are loaded
window.pdx.maps.init = function () {

if ( window.pdx.maps.mapsloaded ) {
    console.log( "[window.pdx.maps]: init method already fired" );
    
	return false;
}

// Closure global vars
var geocoder = new google.maps.Geocoder();

/**
 * Extendable Overlay Class for google.maps
 * Following the Class inheritance example by @resig:
 * http://ejohn.org/blog/simple-javascript-inheritance/
 *
 * The google.maps.OverlayView Class has these methods:
 *
 * addListener
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

// Base overlay methods
Overlay.prototype.draw = function () {
    var pixelPosition = this.getProjection().fromLatLngToDivPixel( this.latLng );
    
    if ( !pixelPosition ) {
    	console.log( "[Overlay failed]" );
    	
    	return false;
    }
    
    this.element.style.left = (pixelPosition.x-(this.element.clientWidth/2))+"px";
    this.element.style.top = (pixelPosition.y-(this.element.clientHeight))+"px";
};

Overlay.prototype.setPosition = function ( position ) {
    if ( !this.element ) {
		return false;
	}
	
	this.latLng = position;
	this.draw();
	
	return true;
};

Overlay.prototype.getPosition = function () {
    if ( !this.element ) {
		return null;
	}
	
	return this.latLng;
};

Overlay.prototype.onRemove = function () {
    if ( !this.element ) {
		return false;
	}
	
	this.element.parentNode.removeChild( this.element );
	
	return true;
};

Overlay.prototype.remove = function () {
    if ( !this.element ) {
		return;
	}
	
	this.element.parentNode.removeChild( this.element );
	this.element = null;
};

// Expose Overlay
window.pdx.maps.Overlay = Overlay;
})();

// Adhere to strict after Overlays arguments.callee
"use strict";

// Simple Location Marker Class
window.pdx.maps.Location = window.pdx.maps.Overlay.extend({
	init: function ( options ) {
		if ( !options || !options.latLng ) {
        	console.log( "[Location requires latLng]" );
        	
        	return false;
        }
        
        this.element = document.createElement( "div" );
        this.loaded = false;
        
        for ( var prop in options ) {
        	this[ prop ] = options[ prop ];
        }
        
        if ( this.map ) {
        	this.setMap( this.map );
        }
	},
	
	onAdd: function () {
        // Build marker html
        this.element.style.position = "absolute";
        this.element.className = "marker-location "+this.markerClass;
        this.element.innerHTML = "<div><div></div></div>";
        this.getPanes().floatPane.appendChild( this.element );
        
        // Open to custom marker actions
        if ( this.onAddCallback && typeof this.onAddCallback === "function" ) {
        	this.onAddCallback( this );
        }
    },
});

// Marker Class
window.pdx.maps.Marker = window.pdx.maps.Overlay.extend({
    init: function ( options ) {
        if ( !options || !options.latLng ) {
        	console.log( "[Marker requires latLng]" );
        	
        	return false;
        }
        
        this.element = document.createElement( "div" );
        this.loaded = false;
        
        for ( var prop in options ) {
        	this[ prop ] = options[ prop ];
        }
        
        if ( this.map ) {
        	this.setMap( this.map );
        	
        	this._createBoundsChanger();
        }
    },
    
    onAdd: function () {
        // Build marker html
        this.element.style.position = "absolute";
        this.element.className = "marker-custom "+this.markerClass;
        this.element.innerHTML = "<div><div></div></div>";
        this.tooltip = document.createElement( "span" );
        this.tooltip.className = "tooltip";
        this.tooltip.innerHTML = "<div>"+this.name+"</div>";
        this.loader = document.createElement( "span" );
        this.loader.className = "plus-spinner";
        this.loader.innerHTML = "<div></div>";
        this.element.appendChild( this.tooltip );
        this.element.appendChild( this.loader );
        this.getPanes().floatPane.appendChild( this.element );
        
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
    },
    
    panMap: function () {
        if ( !this.map || !this.infowindow ) {
			return;
		}
		
		var bounds = this.map.getBounds(),
		
		    // Coords are center of latLng in pixels
			coords = this.getProjection().fromLatLngToDivPixel( this.latLng ),
			
			// Infowindow dimensions
			iwHeight = this.infowindow.clientHeight,
			iwWidth = this.infowindow.clientWidth,
			
			// Marker elements dimensions
			e = {
    			top: this.element.offsetTop,
    			left: this.element.offsetLeft,
    			width: this.element.clientWidth,
    			height: this.element.clientHeight
			},
			
			// Infowindows corners
			o = {
			    iwTopLeft: new google.maps.Point( coords.x-(iwWidth/2), coords.y-iwHeight ),
    			iwTopRight: new google.maps.Point( coords.x+(iwWidth/2), coords.y-iwHeight ),
    			iwBottomLeft: new google.maps.Point( coords.x-(iwWidth/2), coords.y ),
    			iwBottomRight: new google.maps.Point( coords.x+(iwWidth/2), coords.y )
			},
			
			// We need to figure these out
			containsNE,
			containsSW,
			iwNELatLng,
			iwSWLatLng,
			iwNWLatLng,
			iwSELatLng,
			newLatLng,
			newPoint,
			newX, 
			newY;
			
		if ( !bounds ) {
			return;
		}
		
		iwNELatLng = this.getProjection().fromDivPixelToLatLng( o.iwTopRight );
		iwSWLatLng = this.getProjection().fromDivPixelToLatLng( o.iwBottomLeft );
		iwNWLatLng = this.getProjection().fromDivPixelToLatLng( o.iwTopLeft );
		iwSELatLng = this.getProjection().fromDivPixelToLatLng( o.iwBottomRight );
		
		containsNE = bounds.contains( iwNELatLng );
		containsSW = bounds.contains( iwSWLatLng );
		containsNW = bounds.contains( iwNWLatLng );
		containsSE = bounds.contains( iwSELatLng );
		
		//if ( !containsNE || !containsSW || !containsNW || !containsSE ) {
			newX = coords.x;
			
			// Padding by 100px to clear the fixed header
			newY = coords.y-100;
			
			newPoint = new google.maps.Point( newX, newY );
			newLatLng = this.getProjection().fromDivPixelToLatLng( newPoint );
			
			this.map.panTo( newLatLng );
		//}
		
		google.maps.event.removeListener( this.beChange );
    },
    
    _createBoundsChanger: function () {
	    var self = this;
	    
	    this.beChange = google.maps.event.addListener(
            this.map,
            "bounds_changed",
            function () {
                return self.panMap.apply( self );
			}
		);
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
};

// Location
window.pdx.maps.portland = new google.maps.LatLng( 45.5236, -122.6750 );

window.pdx.maps.location = {
	lat: null,
    lng: null,
    isset: false
};

// Map settings
window.pdx.maps.settings = {
    center: window.pdx.maps.portland,
	disableDoubleClickZoom: false,
	draggingCursor: "move",
	draggableCursor: "default",
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	mapTypeControl: false,
	panControl: false,
	panControlOptions: {
		position: google.maps.ControlPosition.LEFT_CENTER
	},
	scrollwheel: false,
	styles: window.pdx.mapstyles || [],
	zoom: 7,
	zoomControlOptions: {
		position: google.maps.ControlPosition.LEFT_CENTER,
		style: google.maps.ZoomControlStyle.LARGE
	}
};

// Fire onmapsready callbacks
window.pdx.maps.firemapsready();

// Set the mapsloaded state
window.pdx.maps.mapsloaded = true;

} // END: window.pdx.maps.init

})( window );