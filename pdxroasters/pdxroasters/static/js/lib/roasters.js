/**
 * PDX Roaster Javascript
 *
 * @dependencies:
 * /static/js/ender/ender.js
 * /static/js/pdx.js
 * /static/js/utils.js
 * /static/js/lib/mapping.js
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
            
            if ( !self.$navTog.hasClass( "active" ) ) {
            	self.$info.removeClass( "active" );
            	
            } else {
                $( "[href='"+self.activeHash+"']" ).click();
            }
        });
        
        this.$navLinks.on( "click", function ( e ) {
            e.preventDefault();
            
            if ( !self.$info.hasClass( "active" ) ) {
            	self.$info.addClass( "active" );
            }
            
            self.$info.css( "top", $( window ).scrollTop() );
            
            self.$navLinks.removeClass( "on" );
            $( this ).addClass( "on" );
            
            self.$activePanel = $( this.hash );
            self.activeHash = this.hash;
            
            self.$panelWrap.css( "left", -(Number(self.$activePanel.data( "panel" ))*window.innerWidth) );
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
            
            if ( $elem.parent().hasClass( "loaded" ) ) {
            	return false;
            }
            
            $elem.parent().addClass( "active" );
            $tip.css( "top", -($tip.height()+3) );
        
        // Hide roaster content
        }).on( "mouseout", "> div", function ( e ) {
            var $elem = $( this ),
                $tip = $elem.parent().find( ".tooltip" );
            
            if ( $elem.parent().hasClass( "loaded" ) ) {
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
            	
            	if ( $tip.hasClass( "inactive" ) ) {
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
                        
                        if ( $tip.hasClass( "inactive" ) ) {
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
        
        this.$info.css({
            height: window.innerHeight,
            width: window.innerWidth
        });
        
        this.$panels.css({
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
            
            if ( $roaster.hasClass( "active" ) ) {
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
        
        window.onresize = function () {
            var css = {
                height: window.innerHeight,
                width: window.innerWidth
            };
            
            self.$mapWrap.css( css );
            self.$info.css( css );
            self.$panels.css( css );
            
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