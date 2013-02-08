/*! PDX Roasters - v0.1.0 - 2013-02-08
* http://PROJECT_WEBSITE/
* Copyright (c) 2013 PDX Roasters; Licensed MIT */

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

})( window );
/**
 * PDX Roaster Sitewide Javascript
 *
 * @dependencies:
 * /static/js/ender/*
 * /static/js/pdx.js
 *
 */
(function ( $, window, undefined ) {

"use strict";

// Closure globals
var $document = $( document ),
    $header = $( "#header" );

// Smooth scroll links
$( ".scroll-to" ).on( "click", function ( e ) {
    e.preventDefault();
    
    var $elem = $( this.hash );
    
    $.scrollTo( $elem.offset().top-$header.height() );
});

// Async form handling
$( ".ajax-form" ).on( "submit", function ( e ) {
    e.preventDefault();
    
    $.ajax({
        url: this.action,
        type: "json",
        data: $( this ).serialize(),
        error: function () {
            console.log( "Ajax form error" );
        },
        success: function () {
            console.log( "Ajax form success" );
        }
    });
});

})( ender, window );
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

// Map namespace
window.pdx.maps = {
    lib: "http://maps.google.com/maps/api/js",
    
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

// Expose Overlay
window.pdx.maps.Overlay = Overlay;
})();

// Adhere to strict after Overlays arguments.callee
"use strict";

// Marker Class
window.pdx.maps.Marker = window.pdx.maps.Overlay.extend({
    init: function ( options ) {
        if ( !options || !options.latLng || !options.map ) {
        	console.log( "[Marker requires latLng and map]" );
        	
        	return false;
        }
        
        var self = this;
        
        this.element = document.createElement( "div" );
        this.loaded = false;
        
        for ( var prop in options ) {
        	this[ prop ] = options[ prop ];
        }
        
        this.setMap( this.map );
        
        this.beChange = google.maps.event.addListener(
            this.map,
            "bounds_changed",
            function () {
                return self.panMap.apply( self );
			}
		);
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
			newLatLng,
			newPoint,
			newX, 
			newY;
			
		if ( !bounds ) {
			return;
		}
		
		iwNELatLng = this.getProjection().fromDivPixelToLatLng( o.iwTopRight );
		iwSWLatLng = this.getProjection().fromDivPixelToLatLng( o.iwBottomLeft );
		
		containsNE = bounds.contains( iwNELatLng );
		containsSW = bounds.contains( iwSWLatLng );
		
		if ( !containsNE || !containsSW ) {
			// Need to figure out newX/newY better than this
			newX = coords.x;
			newY = coords.y;
			
			newPoint = new google.maps.Point( newX, newY );
			newLatLng = this.getProjection().fromDivPixelToLatLng( newPoint );
			
			this.map.panTo( newLatLng );
		}
		
		google.maps.event.removeListener( this.beChange );
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

// Fire onmapsready callbacks
window.pdx.maps.firemapsready();

// Set the mapsloaded state
window.pdx.maps.mapsloaded = true;

} // END: window.pdx.maps.init

})( window );
/**
 * PDX Roaster Pushstate Javascript
 *
 * @dependencies:
 * /static/js/ender/*
 * /static/js/pdx.js
 *
 */
(function ( $, window, undefined ) {

"use strict";

// Closure globals
var Class = require( "Class" );

// PushState Class
window.pdx.PushState = Class.extend({
    init: function () {
        this.state;
        this.from;
        this.on;
        this.cache = {};
        this.poppable = false;
        this.pushable = ("history" in window && "pushState" in window.history);
        
        // Enable the popstate event
        this._popEnable();
    },
    
    push: function ( url, callback ) {
        var self = this;
        
        // Keep track of where we came from when pushing
        this.from = window.location.href;
        
        // And where we are going to be afterwards
        this.on = url;
        
        if ( typeof this.before === "function" ) {
        	this.before();
        }
        
        this._get( url, function ( res ) {
            if ( typeof callback === "function" ) {
            	callback( res );
            }
            
            if ( self.pushable ) {
            	window.history.pushState( {}, "", url );
            }
            
            if ( typeof self.after === "function" ) {
            	self.after( res );
            }
            
            // Cache that shit
            self.cache[ url ] = res;
        });
    },
    
    _get: function ( url, callback ) {
        // Pull from cache if we can
        if ( this.cache[ url ] ) {
        	if ( typeof callback === "function" ) {
        		callback( this.cache[ url ] );
        	}
        	
        	return false;
        }
        
        $.ajax({
            url: url,
            type: "json",
            error: function ( xhr ) {
                var err = {
                    text: xhr.statusText,
                    code: xhr.status,
                    error: true
                }
                
                if ( typeof callback === "function" ) {
                	callback( err );
                }
            },
            success: function ( res ) {
                if ( typeof callback === "function" ) {
                	callback( res );
                }
            }
        });
    },
    
    _popEnable: function () {
        if ( !this.pushable || this.poppable ) {
        	return false;
        }
        
        var self = this;
        
        // Popping
        this.poppable = true;
        
        // Add the handler
        window.onpopstate = function ( e ) {
            self.state = e.state;
        };
    }
});

})( ender, window );
/**
 * PDX Roaster Templates
 *
 * @dependencies:
 * /static/js/ender/*
 * /static/js/pdx.js
 *
 * Using Mustache compiled with Ender:
 * https://github.com/janl/mustache.js
 *
 * Mustache methods/properties:
 * name
 * tags
 * version
 * Context
 * Writer
 * Scanner
 * escape
 * parse
 * clearCache
 * compile
 * compilePartial
 * compileTokens
 * render
 * to_html
 *
 */
(function ( $, window, undefined ) {

"use strict";

// Closure global
var mustache = require( "mustache" );

// Templates namespace
window.pdx.templates = {
    infowindow: function ( view ) {
        var tmpl = "";
        
        tmpl = '<h3>{{ name }}</h3>';
        tmpl += '<div class="group">';
            tmpl += '<div class="col col1of2">';
                tmpl += '<div class="ci">{{ address }}</div>';
            tmpl += '</div>';
            tmpl += '<div class="col col1of2">';
                tmpl += '<p class="hours ci">';
                    tmpl += 'Mon. - Fri. <span>8 - 12</span><br />';
                    tmpl += 'Sat. <span>8 - 12</span><br />';
                    tmpl += 'Sun. <span>8 - 12</span>';
                tmpl += '</p>';
            tmpl += '</div>';
        tmpl += '</div>';
        tmpl += '<div class="btns group">';
            tmpl += '<div class="col col1of2">';
                tmpl += '<div class="ci"><a href="#{{ id }}" class="btn find">Find this Roast</a></div>';
            tmpl += '</div>';
            tmpl += '<div class="col col1of2">';
                tmpl += '<div class="ci"><a href="/roaster/{{ slug }}/" class="btn more">Learn More</a></div>';
            tmpl += '</div>';
        tmpl += '</div>';
        tmpl += '<a href="#close" class="plus-close">Close</div>';
        
        return mustache.render( tmpl, view );
    }
}

})( ender, window );
/**
 * PDX Roaster Javascript
 *
 * @dependencies:
 * /static/js/ender/*
 * /static/js/pdx.js
 * /static/js/lib/*
 *
 */
(function ( $, window, undefined ) {

"use strict";

// Closure globals
var $document = $( document ),
    $header = $( "#header" );

// Home Controller
window.pdx.app.home = {
    init: function () {
        var self = this;
        
        this._nav();
        this._premaps();
        this._roasters();
        this._info();
        this._resize();
        this._pushes();
    },
    
    _nav: function () {
        var self = this;
        
        this.$nav = $( "#nav" );
        this.$navTog = this.$nav.find( ".plus" );
        this.$navLinks = this.$nav.find( "a:not(.plus)" );
        
        this.$navTog.on( "click", function ( e ) {
            e.preventDefault();
            
            self.$navTog.toggleClass( "active" );
            self.$nav.toggleClass( "active" );
            
            if ( !self.$navTog.is( ".active" ) ) {
            	self.$info.removeClass( "active" );
            	
            } else {
                $( "[href='"+self.activeHash+"']" ).click();
            }
        });
        
        this.$navLinks.on( "click", function ( e ) {
            e.preventDefault();
            
            if ( !self.$info.is( ".active" ) ) {
            	self.$info.addClass( "active" );
            }
            
            self.$info.css( "top", $( window ).scrollTop() );
            
            self.$navLinks.removeClass( "on" );
            $( this ).addClass( "on" );
            
            self.$activePanel = $( this.hash );
            self.activeHash = this.hash;
            
            self.$panelWrap.css( "left", -(self.$activePanel.index()*$document.width()) );
        });
    },
    
    _premaps: function () {
        var self = this;
        
        this.$mapWrap = $( "#map-wrap" );
        this.$map = $( "#map" );
        this.$mapPage = $( "#map-page" );
        this.$closeMapPage = this.$mapPage.find( ".plus-close" );
        this.mapElem = this.$map.get( 0 );
        this.mapMarkers = [];
        
        this.$mapWrap.add( this.$mapPage ).height( window.innerHeight );
        
        this.$closeMapPage.on( "click", function ( e ) {
            e.preventDefault();
            
            self.$mapPage.removeClass( "active" );
        });
        
        // Listen for maps to be loaded and ready
        window.pdx.maps.onmapsready(function () {
            self._map();
        });
    },
    
    _map: function () {
        var self = this;
        
        // Google maps
        this.portland = {
            lat: 45.5239,
            lng: -122.67,
            latLng: new google.maps.LatLng( 45.5239, -122.67 )
        };
        this.mapSettings = {
            center: this.portland.latLng,
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
			streetViewControl: false,
			zoom: 15,
			zoomControlOptions: {
				position: google.maps.ControlPosition.LEFT_CENTER,
				style: google.maps.ZoomControlStyle.LARGE
			}
        };
        
        this.mapBounds = new google.maps.LatLngBounds();
        this.map = new google.maps.Map( this.mapElem, this.mapSettings );
        var mapStyles = [
          {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
              { "visibility": "on" },
              { "color": "#c4d3d8" }
            ]
          },{
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
              { "color": "#ffffff" },
              { "visibility": "on" }
            ]
          },{
            "featureType": "landscape.man_made",
            "stylers": [
              { "visibility": "on" },
              { "color": "#e7e4d9" }
            ]
          },{
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [
              { "visibility": "on" },
              { "color": "#c2dc96" }
            ]
          },{
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
              { "color": "#adafae" },
              { "visibility": "on" }
            ]
          },{
            "featureType": "road.arterial",
            "elementType": "labels.text.stroke",
            "stylers": [
              { "weight": 1.6 },
              { "visibility": "on" },
              { "color": "#f9f6ed" }
            ]
          },{
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
              { "color": "#aeaead" }
            ]
          },{
            "featureType": "poi",
            "elementType": "labels",
            "stylers": [
              { "visibility": "off" }
            ]
          },{
            "featureType": "transit",
            "elementType": "labels.icon",
            "stylers": [
              { "visibility": "off" }
            ]
          },{
            "featureType": "road.highway",
            "elementType": "labels.icon",
            "stylers": [
              { "visibility": "off" }
            ]
          },{
            "featureType": "road.arterial",
            "elementType": "geometry.stroke",
            "stylers": [
              { "visibility": "on" },
              { "color": "#c8c9c9" }
            ]
          },{
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
              { "visibility": "on" },
              { "color": "#c1c2c2" }
            ]
          },{
            "featureType": "road.local",
            "elementType": "labels.text.fill"  },{
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
              { "color": "#bebab4" }
            ]
          },{
            "featureType": "road.highway",
            "elementType": "labels.text.stroke",
            "stylers": [
              { "color": "#fffffe" }
            ]
          },{
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
              { "color": "#898c8c" }
            ]
          },{
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
              { "color": "#969694" }
            ]
          },{
            "featureType": "transit.line",
            "elementType": "geometry.fill",
            "stylers": [
              { "lightness": 9 },
              { "visibility": "on" },
              { "color": "#8f908d" }
            ]
          },{
            "featureType": "administrative.land_parcel",
            "elementType": "geometry.stroke",
            "stylers": [
              { "color": "#d6d2cc" }
            ]
          },{
            "featureType": "poi.sports_complex",
            "elementType": "geometry.fill",
            "stylers": [
              { "color": "#ccd89d" }
            ]
          },{
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [
              { "color": "#9e9a97" },
              { "visibility": "off" }
            ]
          },{
            "featureType": "administrative",
            "elementType": "labels.text.stroke",
            "stylers": [
              { "visibility": "off" }
            ]
          },{
            "featureType": "transit",
            "elementType": "labels.text",
            "stylers": [
              { "color": "#6c9e85" },
              { "visibility": "off" }
            ]
          }
        ];
        this.map.setOptions({styles: mapStyles});      
        if ( !this.$roasterItems.length ) {
        	return false;
        }
        
        this.$roasterItems.each(function ( i ) {
            var $elem = $( this ),
                data = $elem.data(),
                points = data.latlng,
                name = data.name,
                api = data.api = "/api/roaster/"+this.id+"/",
                address = data.address,
                id = this.id,
                latLng,
                marker;
            
            if ( !points ) {
            	window.pdx.maps.geocode(
                	{ address: address+" Portland, Oregon" },
                	function ( location ) {
                    	latLng = location;
                    	marker = new window.pdx.maps.Marker({
                            latLng: latLng,
                            map: self.map,
                            onAddCallback: function ( inst ) {
                                self._onAddMarker( inst, data );
                            }
                        });
                        
                        self.mapMarkers.push( marker );
                        self.mapBounds.extend( latLng );
                        
                        if ( self.mapMarkers.length === self.$roasterItems.length ) {
                            self.map.fitBounds( self.mapBounds );
                        }
                	}
            	);
            	
            } else {
                try {
                    points = JSON.parse( points );
                    
                } catch ( error ) {
                    console.log( "[window.pdx.home]: Did not parse lat/lng" );
                }
                
                if ( typeof points === "object" ) {
                	latLng = new google.maps.LatLng( points[ 0 ], points[ 1 ] );
                    marker = new window.pdx.maps.Marker({
                        latLng: latLng,
                        map: self.map,
                        onAddCallback: function ( inst ) {
                            self._onAddMarker( inst, data );
                        }
                    });
                    
                    self.mapMarkers.push( marker );
                    self.mapBounds.extend( latLng );
                }
            }
        });
        
        if ( this.mapMarkers.length === this.$roasterItems.length ) {
        	this.map.fitBounds( this.mapBounds );
        }
    },
    
    _onAddMarker: function ( instance, data ) {
        var self = this,
            $instance = $( instance.element ),
            $tip = $instance.find( ".tooltip" ),
            $spin = $instance.find( ".plus-spinner > div" ),
            $infowindow,
            timeout;
        
        $instance.find( ".tooltip" ).text( data.name );
        
        // Reveal roaster content
        $instance.on( "mouseenter", "> div", function () {
            var $elem = $( this );
            
            if ( $infowindow && !$infowindow.is( ".inactive" ) ) {
                $tip.addClass( "loading" )
                    .css( "top", "50%" );
            	return false;
            }
            
            $instance.addClass( "active" );
            $tip.removeClass( "loading" )
                .css( "top", -($tip.height() - 4) );
        
        // Hide roaster content
        }).on( "mouseleave", "> div", function ( e ) {
            var $elem = $( this );
            
            if ( $infowindow && !$infowindow.is( ".inactive" ) ) {
            	$tip.addClass( "loading" )
            	   .css( "top", "50%" );
            	return false;
            }
            
            $instance.removeClass( "active" );
            $tip.removeClass( "loading" )
                .css( "top", "50%" );
        });
        
        // Request the detailed content
        $instance.on( "click", "> div", function ( e ) {
            var $elem = $( this );
            
            $( ".marker-custom" ).removeClass( "active" );
            $( ".infowindow" ).addClass( "inactive" );
            
            if ( instance.loaded ) {
                $instance.addClass( "active" );
            	$infowindow.toggleClass( "inactive" );
            	$tip.addClass( "loading" )
            	   .css( "top", "50%" );
            	
            	if ( $infowindow.is( ".inactive" ) ) {
                	$infowindow.css( "top", "80%" );
                	
                } else {
                    $infowindow.css( "top", -($infowindow.height()+3) );
                }
            	
            	return false;
            }
            
            $tip.addClass( "loading" );
            
            $spin.parent().addClass( "active" );
            $spin.addClass( "loading" );
            
            function _loading() {
                timeout = setTimeout(function () {
                    $spin.toggleClass( "loading" );
                    
                    _loading();
                    
                }, 300 );
            }
            
            _loading();
            
            $.ajax({
                url: data.api,
                type: "json",
                data: {
                    format: "json"
                },
                error: function () {
                    clearTimeout( timeout );
                    
                    console.log( "Infowindow load error" );
                },
                success: function ( response ) {
                    var html = window.pdx.templates.infowindow( response );
                    
                    clearTimeout( timeout );
                    
                    instance.loaded = true;
                    
                    $infowindow = $( "<span>" ).addClass( "infowindow" ).hide();
                    
                    instance.infowindow = $infowindow[ 0 ];
                    
                    $infowindow.html( html )
                        .insertAfter( $tip )
                        .css( "top", -($infowindow.height() + 20) )
                        .css( "left", -(($infowindow.width()/2)-($elem.width()/2)) );
                    
                    $infowindow.find( ".plus-close" ).on( "click", function ( e ) {
                        e.preventDefault();
                        
                        $infowindow.toggleClass( "inactive" );
                        
                        if ( $infowindow.is( "inactive" ) ) {
                        	$infowindow.css( "top", "50%" );
                        	
                        } else {
                            $infowindow.css( "top", -($infowindow.height()+3) );
                        }
                    });
                    
                    $infowindow.find( ".find" ).on( "click", function ( e ) {
                        e.preventDefault();
                        
                        var $elem = $( this.hash ),
                            $toggle = $elem.find( ".toggle" );
                        
                        if ( $elem.is( ".active" ) ) {
                        	$.scrollTo( $elem.offset().top-$header.height() );
                        	
                        	return false;
                        }
                        
                        self.$roasterTogs.removeClass( "active" );
                        $toggle.addClass( "active" );
                        
                        self.$roasterItems.removeClass( "active" );
                        $elem.addClass( "active" );
                        
                        $.scrollTo( $elem.offset().top-$header.height() );
                    });
                    
                    $infowindow.find( ".more" ).on( "click", function ( e ) {
                        e.preventDefault();
                        
                        self.pushState.push( this.href, function ( res ) {
                            if ( res.error ) {
                            	//return false;
                            }
                            
                            self.$mapPage.addClass( "active" );
                        });
                    });
                    
                    // Slight delay for loadout
                    setTimeout(function () {
                        $infowindow.show().removeClass( "loading" );
                        
                        $spin.parent().removeClass( "active" );
                        $spin.removeClass( "loading" );
                        
                        $instance.addClass( "loaded" )
                            .addClass( "active" );
                        
                        instance.panMap();
                        
                    }, 300 );
                }
            });
        });
    },
    
    _info: function () {
        this.$info = $( "#info-panel" );
        this.$panelWrap = this.$info.find( ".panels" );
        this.$panels = this.$info.find( ".panel" );
        
        this.$panels.width( $document.width() );
        this.$panelWrap.width( $document.width()*this.$panels.length );
        
        this.$info.add( this.$panels ).height( window.innerHeight );
    },
    
    _roasters: function () {
        var self = this;
        
        this.$roasters = $( "#roasters" );
        this.$roasterItems = this.$roasters.find( ".roaster" );
        this.$roasterTogs = this.$roasters.find( ".toggle" );
        this.$roasterHandles = this.$roasters.find( ".handle" );
        
        if ( !this.$roasterItems.length ) {
        	this.$roasters.find( ".suggest" ).on( "click", function ( e ) {
            	e.preventDefault();
            	
            	$( "[href='"+this.hash+"']" ).click();
        	});
        	
        	return false;
        }
        
        this.$roasterHandles.on( "click", function ( e ) {
            e.preventDefault();
            
            var $elem = $( this ),
                $toggle = $elem.find( ".toggle" ),
                $roaster = $elem.closest( ".roaster" );
            
            if ( $roaster.is( ".active" ) ) {
            	$toggle.removeClass( "active" );
            	self.$roasterItems.removeClass( "active" );
            	
            	return false;
            }
            
            self.$roasterTogs.removeClass( "active" );
            $toggle.addClass( "active" );
            
            self.$roasterItems.removeClass( "active" );
            $roaster.addClass( "active" );
            
            $.scrollTo( $roaster.offset().top-$header.height() );
        });
    },
    
    _resize: function () {
        var self = this;
        
        window.onresize = function () {
            self.$mapWrap
                .add( self.$mapPage )
                .add( self.$info )
                .add( self.$panels )
                .height( window.innerHeight );
            
            self.$panels.width( $document.width() );
            self.$panelWrap.width( $document.width()*self.$panels.length );
        };
    },
    
    _pushes: function () {
        var self = this;
        
        this.pushState = new window.pdx.PushState();
        
        // Global before/after pushstate handlers
        this.pushState.before = function () {
            console.log( "before", arguments );
        };
        
        this.pushState.after = function () {
            console.log( "after", arguments );
        };
    }
};

})( ender, window );
/**
 * PDX Roaster Application Contoller
 *
 * @dependencies:
 * /static/js/ender/*
 * /static/js/pdx.js
 * /static/js/lib/*
 *
 */
(function ( $, window ) {

"use strict";

// Run controller
var controller = $( document.body ).data( "controller" );

if ( window.pdx.app[ controller ] && window.pdx.app[ controller ].init ) {
	window.pdx.app[ controller ].init();
}

})( ender, window );