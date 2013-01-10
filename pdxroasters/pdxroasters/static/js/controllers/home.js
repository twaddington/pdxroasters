/**
 * PDX Roaster Javascript
 *
 * @dependencies:
 * /static/js/ender/*
 * /static/js/pdx.js
 * /static/js/lib/*
 *
 */
(function ( window, undefined ) {

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
        
        // Listen for maps to be loaded and ready
        window.pdx.maps.onmapsready(function () {
            self._map();
        });
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
                .css( "top", -($tip.height()+3) );
        
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
                	$infowindow.css( "top", "50%" );
                	
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
                    var html = "";
                    
                    clearTimeout( timeout );
                    
                    instance.loaded = true;
                    
                    $infowindow = $( "<span>" ).addClass( "infowindow" ).hide();
                    
                    instance.infowindow = $infowindow[ 0 ];
                    
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
                            html += '<div class="ci"><a href="/roaster/'+response.slug+'/" class="btn more">Learn More</a></div>';
                        html += '</div>';
                    html += '</div>';
                    html += '<a href="#close" class="plus-close">Close</div>';
                    
                    $infowindow.html( html )
                        .insertAfter( $tip )
                        .css( "top", -($infowindow.height()+3) )
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
        
        this.pushState = window.pdx.pushstate();
        
        // Global before/after pushstate handlers
        this.pushState.before = function () {
            console.log( "before", arguments );
        };
        
        this.pushState.after = function () {
            console.log( "after", arguments );
        };
    }
};

// Page basic tasks
$( ".scroll-to" ).on( "click", function ( e ) {
    e.preventDefault();
    
    var $elem = $( this.hash );
    
    $.scrollTo( $elem.offset().top-$header.height() );
});

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

})( window );