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
var $document = $( document );

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
                $( "[data-page='"+self.activePage+"']" ).click();
            }
        });
        
        this.$navLinks.on( "click", function ( e ) {
            e.preventDefault();
            
            if ( !self.$info.is( ".active" ) ) {
            	self.$info.addClass( "active" );
            }
            
            var $this = $( this ),
            	page = $this.data( "page" ),
            	$lastPage = self.$activePage;
            
            //self.$info.css( "top", $( window ).scrollTop() );
            
            self.$navLinks.removeClass( "on" );
            $this.addClass( "on" );
            
            self.$activePage = $( "#"+page );
            self.activePage = page;
            
            if ( $lastPage && $lastPage.index() > self.$activePage.index() ) {
            	$lastPage.css( "left", "100%" );
            	
            } else if ( $lastPage && $lastPage.index() < self.$activePage.index() ) {
	            $lastPage.css( "left", "-100%" );
            }
            
            self.$activePage.css( "left", 0 );
        });
    },
    
    _premaps: function () {
        var self = this;
        
        this.$mapWrap = $( "#map-wrap" );
        this.$map = $( "#map" );
        this.mapElem = this.$map.get( 0 );
        this.mapMarkers = [];
        
        this.$mapWrap.height( window.innerHeight );
        
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
			styles: window.pdx.mapstyles || [],
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
              { "color": "#25a1ae" }
            ]
          },{
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
              { "color": "#fafafa" },
              { "visibility": "on" }
            ]
          },{
            "featureType": "landscape.man_made",
            "stylers": [
              { "visibility": "on" },
              { "color": "#e9e1bd" }
            ]
          },{
            "featureType": "poi",
            "elementType": "geometry.fill",
            "stylers": [
              { "color": "#dbd3b4" }
            ]
          },{
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [
              { "visibility": "on" },
              { "color": "#c1db96" }
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
              { "color": "#cec7aa" }
            ]
          },{
            "featureType": "administrative.land_parcel",
            "elementType": "geometry.fill",
            "stylers": [
              { "color": "#cec7aa" }
            ]
          },{
            "featureType": "administrative.land_parcel",
            "elementType": "labels",
            "stylers": [
              { "visibility": "off" }
            ]
          },{
            "featureType": "landscape.man_made",
            "elementType": "labels",
            "stylers": [
              { "visibility": "off" }
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
        
        // Reveal Roaster name rollover
        $instance.on( "mouseenter", "> div", function () {
            var $elem = $( this );
            // If modal is active...
            if ( $infowindow && !$infowindow.is( ".inactive" ) ) {
                $tip.addClass( "loading" );
                return false;
            }
            // When modal is not active...
            $instance.addClass( "active" );
            $tip.removeClass( "loading" );
        
        // Hide Roaster Name rollover
        }).on( "mouseleave", "> div", function ( e ) {
            var $elem = $( this );
            // When infowindow is active...
            if ( $infowindow && !$infowindow.is( ".inactive" ) ) {
                $tip.addClass( "loading" );
                return false;
            }
            // When it's not active...
            $instance.removeClass( "active" );
            $tip.removeClass( "loading" );
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
                        	$.scrollTo( $elem.offset().top );
                        	
                        	return false;
                        }
                        
                        self.$roasterTogs.removeClass( "active" );
                        $toggle.addClass( "active" );
                        
                        self.$roasterItems.removeClass( "active" );
                        $elem.addClass( "active" );
                        
                        $.scrollTo( $elem.offset().top );
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
        this.$info = $( "#info-pages" );
        this.$pages = this.$info.find( ".page" );
        this.$info.add( this.$pages ).height( window.innerHeight );
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
            
            $.scrollTo( $roaster.offset().top );
        });
    },
    
    _resize: function () {
        var self = this;
        
        window.onresize = function () {
            self.$mapWrap
                .add( self.$info )
                .add( self.$pages )
                .height( window.innerHeight );
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