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
            var points = /* $( this ).data( "latlng" ) */_latLngs[ i ],
                latLng = new google.maps.LatLng( points[ 0 ], points[ 1 ] ),
                marker = new window.pdx.maps.Marker({
                    latLng: latLng,
                    map: self.map
                });
            
            self.mapMarkers.push( marker );
            self.mapBounds.extend( latLng );
        });
        
        this.map.fitBounds( this.mapBounds );
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