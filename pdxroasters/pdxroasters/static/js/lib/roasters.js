/**
 * PDX Roaster Javascript
 *
 * @dependencies:
 * /static/js/vendor/*
 * /static/js/pdx.js
 * /static/js/lib/mapping.js
 *
 * @json:
 * http://localhost:8000/api/roaster/?format=json
 *
 */
(function ( $, window, undefined ) {

"use strict";

// Closure global vars
var $body = $( document.body ),
    
    // TEMP until roaster.lat/roaster.lng
    _latLngs = [
        [45.5229, -122.643],
        [45.5239, -122.67981]
    ];

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
            
            if ( !self.$navTog.is( ".active" ) ) {
            	self.$info.removeClass( "active" );
            	
            } else {
                self.$navLinks.filter( "[href='"+self.activeHash+"']" ).click();
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
            
            self.$activePanel = self.$panels.filter( this.hash );
            self.activeHash = this.hash;
            
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
        
        this.$roasterItems.each(function ( i ) {
            var $elem = $( this ),
                points = /* $elem.data( "latlng" ) */_latLngs[ i ],
                name = $elem.data( "name" ),
                api = /* $elem.data( "api" ) */"/api/roaster/"+this.id+"/",
                id = this.id,
                latLng = new google.maps.LatLng( points[ 0 ], points[ 1 ] ),
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
        });
        
        this.map.fitBounds( this.mapBounds );
    },
    
    _onAddMarker: function ( instance ) {
        var self = this;
        
        // Reveal roaster content
        $( instance.element ).on( "mouseover", "> div", function () {
            var $elem = $( this ),
                $tip = $elem.parent().find( ".tooltip" );
            
            if ( $elem.parent().is( ".loaded" ) ) {
            	return false;
            }
            
            $elem.parent().addClass( "active" );
            $tip.css( "top", -($tip.outerHeight()+3) );
        
        // Hide roaster content
        }).on( "mouseout", "> div", function ( e ) {
            var $elem = $( this ),
                $tip = $elem.parent().find( ".tooltip" );
            
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
            	
            	if ( $tip.is( ".inactive" ) ) {
                	$tip.css( "top", "50%" );
                	
                } else {
                    $tip.css( "top", -($tip.outerHeight()+3) );
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
                type: "GET",
                dataType: "json",
                data: {
                    format: "json"
                }
            })
            .done(function ( response ) {
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
                    .css( "top", -($tip.outerHeight()+3) )
                    .css( "left", -(($tip.outerWidth()/2)-($elem.outerWidth()/2)) );
                
                $tip.find( ".plus-close" ).on( "click", function ( e ) {
                    e.preventDefault();
                    
                    $tip.toggleClass( "inactive" );
                    
                    if ( $tip.is( ".inactive" ) ) {
                    	$tip.css( "top", "50%" );
                    	
                    } else {
                        $tip.css( "top", -($tip.outerHeight()+3) );
                    }
                });
                
                $tip.find( ".find" ).on( "click", function ( e ) {
                    e.preventDefault();
                    
                    var $elem = $( this.hash ),
                        destination = $elem.offset().top;
                    
                    $elem.find( ".toggle" ).click();
            
                    $( "body, html" ).animate( {"scrollTop": destination}, 400 );
                });
                
                setTimeout(function () {
                    $tip.show().removeClass( "loading" );
                    
                    $spin.parent().removeClass( "active" );
                    $spin.removeClass( "loading" );
                    
                    $elem.parent().addClass( "loaded" );
                    
                }, 300 );
                
            })
            .fail(function () {
                clearTimeout( timeout );
                
                console.log( "[Marker load error]" );
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
        
        this.$roasterTogs.on( "click", function ( e ) {
            e.preventDefault();
            
            if ( $( this ).is( ".active" ) ) {
            	$( this ).removeClass( "active" );
            	self.$roasterItems.removeClass( "active" );
            	
            	return false;
            }
            
            self.$roasterTogs.removeClass( "active" );
            $( this ).addClass( "active" );
            
            self.$roasterItems.removeClass( "active" );
            $( this ).closest( ".roaster" ).addClass( "active" );
        });
    },
    
    _resize: function () {
        var self = this;
        
        window.onresize = function () {
            self.$mapWrap.css({
                height: window.innerHeight,
                width: window.innerWidth
            });
            
            self.$info.add( self.$panels ).css({
                height: window.innerHeight,
                width: window.innerWidth
            });
            
            self.$panelWrap.width( window.innerWidth*self.$panels.length );
        };
    }
};

// Override utility space for this controller
window.pdx.utils = {
    init: function () {
        $( ".scroll-to" ).on( "click", function ( e ) {
            e.preventDefault();
            
            var $elemTo = $( this.hash ),
                destination = $elemTo.offset().top;
            
            $( "body, html" ).animate( {"scrollTop": destination}, 400 );
        });
        
        $( ".ajax-form" ).on( "submit", function ( e ) {
            e.preventDefault();
            
            $.ajax({
                url: this.action,
                type: this.method,
                data: $( this ).serialize()
            })
            .done(function () {
                console.log( "done" );
            })
            .fail(function () {
                console.log( "fail" );
            });
        });
    }
};

})( jQuery, window );