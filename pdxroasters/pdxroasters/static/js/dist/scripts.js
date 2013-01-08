/*! PDX Roasters - v0.1.0 - 2013-01-08
* http://PROJECT_WEBSITE/
* Copyright (c) 2013 PDX Roasters; Licensed MIT */


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
/**
 * PDX Roaster Namespace
 *
 */
(function () {

// Console fallback
window.console = window.console || function () {};

// Create our global namespace
window.pdx = {};

// Application space
window.pdx.app = {};

})();
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
/**
 * PDX Roaster Javascript
 *
 * @dependencies:
 * /static/js/ender/*
 * /static/js/pdx.js
 * /static/js/lib/*
 *
 * @json:
 * http://localhost:8000/api/roaster/?format=json
 *
 */
(function ( window, undefined ) {

"use strict";

// Home Controller
window.pdx.app.home = {
    init: function () {
        this._info();
        this._nav();
        this._roasters();
        this._map();
        this._resize();
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
            
            console.log( "check" );
            if ( !self.$navTog.is( ".active" ) ) {
            	self.$info.removeClass( "active" );
            	
            } else {
                $( "[href='"+self.activeHash+"']" ).click();
            }
        });
        
        this.$navLinks.on( "click", function ( e ) {
            e.preventDefault();
            
            console.log( "check" );
            if ( !self.$info.is( ".active" ) ) {
            	self.$info.addClass( "active" );
            }
            
            self.$info.css( "top", $( window ).scrollTop() );
            
            self.$navLinks.removeClass( "on" );
            $( this ).addClass( "on" );
            
            self.$activePanel = $( this.hash );
            self.activeHash = this.hash;
            
            console.log( "check" );
            self.$panelWrap.css( "left", -(self.$activePanel.index()*window.innerWidth) );
        });
    },
    
    _map: function () {
        var self = this;
        
        this.$mapWrap = $( "#map-wrap" );
        this.$map = $( "#map" );
        this.mapElem = this.$map.get( 0 );
        this.mapMarkers = [];
        
        this.$mapWrap.css({
            height: window.innerHeight,
            width: window.innerWidth
        });
        
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
			streetViewControl: true,
			zoom: 15,
			zoomControlOptions: {
				position: google.maps.ControlPosition.LEFT_CENTER,
				style: google.maps.ZoomControlStyle.LARGE
			}
        };
        
        this.mapBounds = new google.maps.LatLngBounds();
        this.map = new google.maps.Map( this.mapElem, this.mapSettings );
        
        if ( !this.$roasterItems.length ) {
        	return false;
        }
        
        this.$roasterItems.each(function ( i ) {
            var $elem = $( this ),
                points = $elem.data( "latlng" ),
                name = $elem.data( "name" ),
                api = /* $elem.data( "api" ) */"/api/roaster/"+this.id+"/",
                address = $elem.data( "address" ),
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
                            name: name,
                            api: api,
                            id: id,
                            onAddCallback: function () {
                                self._onAddMarker.apply( self, arguments );
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
                latLng = new google.maps.LatLng( points[ 0 ], points[ 1 ] );
                marker = new window.pdx.maps.Marker({
                    latLng: latLng,
                    map: self.map,
                    name: name,
                    api: api,
                    id: id,
                    onAddCallback: function () {
                        self._onAddMarker.apply( self, arguments );
                    }
                });
                
                counter++;
                
                self.mapMarkers.push( marker );
                self.mapBounds.extend( latLng );
            }
        });
        
        if ( this.mapMarkers.length === this.$roasterItems.length ) {
        	this.map.fitBounds( this.mapBounds );
        }
    },
    
    _onAddMarker: function ( instance ) {
        var self = this;
        
        // Reveal roaster content
        $( instance.element ).on( "mouseover", "> div", function () {
            var $elem = $( this ),
                $tip = $elem.parent().find( ".tooltip" );
            
            console.log( "check" );
            if ( $elem.parent().is( ".loaded" ) ) {
            	return false;
            }
            
            $elem.parent().addClass( "active" );
            $tip.css( "top", -($tip.height()+3) );
        
        // Hide roaster content
        }).on( "mouseout", "> div", function ( e ) {
            var $elem = $( this ),
                $tip = $elem.parent().find( ".tooltip" );
            
            console.log( "check" );
            if ( $elem.parent().is( ".loaded" ) ) {
            	return false;
            }
            
            $elem.parent().removeClass( "active" );
            $tip.css( "top", "50%" );
        });
        
        // Request the detailed content
        $( instance.element ).on( "click", "> div", function ( e ) {
            var $elem = $( this ),
                $tip = $elem.parent().find( ".tooltip" ),
                $spin = $elem.parent().find( ".plus-spinner > div" ),
                timeout;
            
            if ( instance.loaded ) {
            	$tip.toggleClass( "inactive" );
            	
            	console.log( "check" );
            	if ( $tip.is( ".inactive" ) ) {
                	$tip.css( "top", "50%" );
                	
                } else {
                    $tip.css( "top", -($tip.height()+3) );
                }
            	
            	return false;
            }
            
            $tip.hide().addClass( "loading" );
            
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
                url: instance.api,
                type: "json",
                data: {
                    format: "json"
                },
                error: function () {
                    clearTimeout( timeout );
                    
                    console.log( "error" );
                },
                success: function ( response ) {
                    var html = "";
                    
                    clearTimeout( timeout );
                    
                    instance.loaded = true;
                    
                    html = '<h3>'+response.name+'</h3>';
                    html += '<div class="group">';
                        html += '<div class="col col1of2">';
                            html += '<div class="ci">'+response.address+'</div>';
                        html += '</div>';
                        html += '<div class="col col1of2">';
                            html += '<p class="hours ci">';
                                html += 'Mon. - Fri. <span>8 - 12</span><br />';
                                html += 'Sat. <span>8 - 12</span><br />';
                                html += 'Sun. <span>8 - 12</span>';
                            html += '</p>';
                        html += '</div>';
                    html += '</div>';
                    html += '<div class="btns group">';
                        html += '<div class="col col1of2">';
                            html += '<div class="ci"><a href="#'+response.id+'" class="btn find">Find this Roast</a></div>';
                        html += '</div>';
                        html += '<div class="col col1of2">';
                            html += '<div class="ci"><a href="/roaster/'+response.slug+'/" class="btn">Learn More</a></div>';
                        html += '</div>';
                    html += '</div>';
                    html += '<a href="#close" class="plus-close">Close</div>';
                    
                    // Overrides roaster name
                    $tip.addClass( "infowindow" )
                        .html( html )
                        .css( "top", -($tip.height()+3) )
                        .css( "left", -(($tip.width()/2)-($elem.width()/2)) );
                    
                    $tip.find( ".plus-close" ).on( "click", function ( e ) {
                        e.preventDefault();
                        
                        $tip.toggleClass( "inactive" );
                        
                        console.log( "check" );
                        if ( $tip.is( "inactive" ) ) {
                        	$tip.css( "top", "50%" );
                        	
                        } else {
                            $tip.css( "top", -($tip.height()+3) );
                        }
                    });
                    
                    $tip.find( ".find" ).on( "click", function ( e ) {
                        e.preventDefault();
                        
                        var $elem = $( this.hash );
                        
                        $elem.find( ".toggle" ).click();
                    });
                    
                    setTimeout(function () {
                        $tip.show().removeClass( "loading" );
                        
                        $spin.parent().removeClass( "active" );
                        $spin.removeClass( "loading" );
                        
                        $elem.parent().addClass( "loaded" );
                        
                    }, 300 );
                }
            });
        });
    },
    
    _info: function () {
        this.$info = $( "#info-panel" );
        this.$panelWrap = this.$info.find( ".panels" );
        this.$panels = this.$info.find( ".panel" );
        
        this.$panelWrap.width( window.innerWidth*this.$panels.length );
        
        this.$info.add( this.$panels ).css({
            height: window.innerHeight,
            width: window.innerWidth
        });
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
            
            console.log( "check" );
            if ( $roaster.is( ".active" ) ) {
            	$toggle.removeClass( "active" );
            	self.$roasterItems.removeClass( "active" );
            	
            	return false;
            }
            
            self.$roasterTogs.removeClass( "active" );
            $toggle.addClass( "active" );
            
            self.$roasterItems.removeClass( "active" );
            $roaster.addClass( "active" );
            
            $roaster.scrollTo();
        });
    },
    
    _resize: function () {
        var self = this;
        
        console.log( "check" );
        window.onresize = function () {
            self.$mapWrap.add( self.$info ).add( self.$panels ).css({
                height: window.innerHeight,
                width: window.innerWidth
            });
            
            self.$panelWrap.width( window.innerWidth*self.$panels.length );
        };
    }
};

// Page basic tasks
$( ".scroll-to" ).on( "click", function ( e ) {
    e.preventDefault();
    
    $( this.hash ).scrollTo();
});

$( ".ajax-form" ).on( "submit", function ( e ) {
    e.preventDefault();
    
    $.ajax({
        url: this.action,
        type: "json",
        data: $( this ).serialize(),
        error: function () {
            console.log( "error" );
        },
        success: function () {
            console.log( "success" );
        }
    });
});

})( window );
/**
 * PDX Roaster Application Contoller
 *
 * @dependencies:
 * /static/js/ender/*
 * /static/js/pdx.js
 * /static/js/lib/*
 *
 */
(function () {

// Run controller
var controller = $( document.body ).data( "controller" );

if ( window.pdx.app[ controller ] && window.pdx.app[ controller ].init ) {
	window.pdx.app[ controller ].init();
}

})();