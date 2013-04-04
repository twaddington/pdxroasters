/**
 * PDX Roaster Javascript
 *
 * @dependencies:
 * /static/js/pdx.js
 * /static/js/lib/*
 *
 */
(function ( $, window, undefined ) {

"use strict";

// Closure globals
var $_document = $( document ),
    $_body = $( document.body ),
    $_window = $( window ),
    $_search = $( "#search > input" ),
    $_header = $( "#header" ),
    $_content = $( "#content" ),
    $_pushPage = $( "#roaster-push-page" ),
    $_pushRoaster = $_pushPage.find( ".roaster" ),
    $_roasters = $( "#roasters" ),
    $_logoBack = $( "#logo" ),
    $_roasterItems = $_roasters.find( ".push-link" ),
    $_roasterTogs = $_roasters.find( ".toggle" ),
    $_roasterHandles = $_roasters.find( ".handle" );

// Home Controller
window.pdx.app.home = {
    init: function () {
        var self = this;
        
        this._premaps();
        this._roasters();
        this._search();
        this._resize();
        this._pushes();
        
        // Activate global nav module
        window.pdx.nav.init();
        
        // TEMP
        $( ".scroll-to" ).on( "click", function ( e ) {
		    e.preventDefault();
		    
		    var $elem = $( this.hash );
		    
		    $.scrollTo( $elem.offset().top-$_header.height() );
		});
    },
    
    _search: function () {
	    $_search.on( "focus", function () {
		    $.scrollTo( $_search.offset().top-$_header.height() );
		    
		    $_roasters.css( "min-height", window.innerHeight-$_header.height() );
	    })
	    .on( "keyup", function ( e ) {
		    var value = this.value;
		    
		    if ( !value.length ) {
		    	$_roasterItems.removeClass( "s-hidden" );
		    }
		    
		    $_roasterItems.each(function () {
		        var regex = new RegExp( "^"+value, "i" ),
		            $this = $( this ),
		            name = $this.data( "name" );
		        
		        if ( value !== "" && !regex.exec( name ) ) {
		        	$this.addClass( "s-hidden" );
		        	
		        } else {
			        $this.removeClass( "s-hidden" );
		        }
		    });
		});
    },
    
    _premaps: function () {
        var self = this;
        
        this.$mapWrap = $( "#map-wrap" );
        this.$map = $( "#map" );
        this.mapElem = this.$map.get( 0 );
        this.mapMarkers = [];
        
        this.$mapWrap.height( window.innerHeight-$_search.height() );
        
        // Listen for maps to be loaded and ready
        window.pdx.maps.onmapsready(function () {
            self._map();
        });
    },
    
    _map: function () {
        var self = this;
        
        this.mapBounds = new google.maps.LatLngBounds();
        this.map = new google.maps.Map( this.mapElem, window.pdx.maps.settings );
             
        if ( !$_roasterItems.length ) {
            return false;
        }
        
        $_roasterItems.each(function ( i ) {
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
                        
                        if ( self.mapMarkers.length === $_roasterItems.length ) {
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
        
        if ( this.mapMarkers.length === $_roasterItems.length ) {
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
                        
                        $_roasterTogs.removeClass( "active" );
                        $toggle.addClass( "active" );
                        
                        $_roasterItems.removeClass( "active" );
                        $elem.addClass( "active" );
                        
                        $.scrollTo( $elem.offset().top );
                    });
                    
                    $infowindow.find( ".more" ).on( "click", function ( e ) {
                        e.preventDefault();
                        
                        self.pushState.push( this.href, function ( res ) {
                            console.log( "info more click...?" );
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
    
    _roasters: function () {
        var self = this;
        
        $_logoBack.on( "click", function ( e ) {
            e.preventDefault();
            
            if ( !$_logoBack.is( ".page-back" ) ) {
            	return false;
            }
            
            self.pushState.pop();
        });
        
        $_roasterItems.on( "click", function ( e ) {
            e.preventDefault();
            
            var $elem = $( this ),
                $toggle = $elem.find( ".toggle" ),
                $roaster = $( "#roaster-"+this.id );
            
            $_pushPage.find( ".content" ).removeClass( "active" );
            
            $roaster.addClass( "active" );
            
            $_roasterTogs.removeClass( "active" );
            $_roasterItems.removeClass( "active" );
            
            $_content.addClass( "inactive" );
            $_pushPage.addClass( "active" );
            
            self.pushState.push( this.href );
        });
    },
    
    _resize: function () {
        var self = this;
        
        window.onresize = function () {
            self.$mapWrap.height( window.innerHeight-$_search.height() );
        };
    },
    
    _pushes: function () {
        var self = this;
        
        this.pushState = new window.pdx.PushState({
            async: false
        });
        
        this.pushState.onpop(function () {
            $_content.removeClass( "inactive" );
            $_pushPage.removeClass( "active" );
        });
    }
};

})( ender, window );