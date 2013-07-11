/**
 * PDX Roaster Javascript
 *
 * @dependencies:
 * /static/js/pdx.js
 * /static/js/lib/*
 *
 *
 */
(function ( $, window, undefined ) {

"use strict";

// Closure globals
var $_document = $( document ),
    $_body = $( document.body ),
    $_window = $( window ),
    $_page = $( "#page" ),
    $_mapWrap = $( "#map-wrap" ),
    $_filter = $( "#filter > input" ),
    $_header = $( "#header" ),
    $_content = $( "#content" ),
    $_pushPage = $( "#roaster-push-page" ),
    $_pushRoaster = $_pushPage.find( ".roaster" ),
    $_roasters = $( "#roasters" ),
    $_logo = $( "#logo" ),
    $_directionLinks = $( ".banner-link" ),
    $_cafeShowing = $( "#close-cafes" ),
    $_cafeClose = $_cafeShowing.find( "span" ),
    $_cafeRoaster = $_cafeShowing.find( "a" ),
    $_roasterItems = $_roasters.find( ".push-link" ),
    $_roasterTogs = $_roasters.find( ".toggle" ),
    $_roasterHandles = $_roasters.find( ".handle" ),
    $_roasterMarkers,
    $_currentInfowindow,
    _currentRoasterId,
    _locationMarker,
    _roasterCafes = {},
    _pagePosition = 0,
    _pushState = new window.pdx.PushState( {async: false} ),
    _pushDuration = 300,
    _scrollAble = document.body.clientHeight-window.innerHeight,
    _atScrollEnd = false,
    _homePageTitle;

// Home Controller
window.pdx.app.home = {
    init: function () {
        var self = this;
        
        this.handlePreMap();
        this.handleRoasters();
        this.handleFilter();
        this.getHomepageTitle();
        
        // Global nav module
        window.pdx.nav.init();
    },
    
    getHomepageTitle: function () {
	    var match = document.title.match( /^.*\| / );
	    
	    if ( match ) {
	    	_homePageTitle = document.title.replace( match, "" );
	    	
	    } else {
		    _homePageTitle = "Portland Coffee Map";
	    }
    },
    
    handleGeolocation: function () {
	    var self = this;
	    
	    if ( pdx.support.geolocation ) {
	    	navigator.geolocation.watchPosition(
	    		// Success
	    		function ( position ) {
		    		var latLng = new google.maps.LatLng( position.coords.latitude, position.coords.longitude );
		    		
		    		window.pdx.maps.location.lat = position.coords.latitude;
		    		window.pdx.maps.location.lng = position.coords.longitude;
		    		window.pdx.maps.location.isset = true;
		    		
		    		if ( _locationMarker ) {
		    			_locationMarker.setPosition( latLng );
		    			
		    		} else {
			    		_locationMarker = new window.pdx.maps.Location({
		                    latLng: latLng,
		                    map: self.map
		                });
		                
		                self.map.setZoom( self.map.getZoom()+2 );
		                self.map.setCenter( latLng );
		    		}
		    		
		    		$_directionLinks.each(function () {
			    		var saddr = this.href.match( /saddr=.*/ );
			    		
			    		if ( saddr ) {
			    			this.href = this.href.replace( saddr[ 0 ], "saddr="+position.coords.latitude+","+position.coords.longitude );
			    			
			    		} else {
				    		this.href = this.href+"&saddr="+position.coords.latitude+","+position.coords.longitude;
			    		}
		    		});
	    		},
	    		
	    		// Failure
	    		function () {},
	    		
	    		{
		    		enableHighAccuracy: true,
		    		timeout: 10000,
		    		maximumAge: 30000
	    		}
	    	);
	    }
    },
    
    handleFilter: function () {
	    var self = this;
	    
	    $_filter.on( "keyup", function ( e ) {
		    var value = this.value,
		    	regex = new RegExp( "^"+value, "i" ),
		    	tempBounds = new google.maps.LatLngBounds(),
		    	filtered = [],
		    	$focused;
		    
		    // Show all items in the list
		    if ( !value.length ) {
		    	$_roasterItems.removeClass( "s-hidden" );
		    	$( ".marker-custom" ).removeClass( "s-hidden" );
		    	$( ".s-focused" ).removeClass( "s-focused" );
		    	
		    	self.map.fitBounds( self.mapBounds.roasters );
		    
		    // We can filter the list
		    } else {
		    	for ( var i = 0, len = self.mapMarkers.length; i < len; i++ ) {
			    	var marker = self.mapMarkers[ i ],
			    		$elem = $( marker.element );
			    	
			    	if ( value !== "" && !regex.exec( marker.tooltip.innerHTML ) ) {
			        	$elem.addClass( "s-hidden" );
			        	
			        } else {
				        $elem.removeClass( "s-hidden" );
				        
				        tempBounds.extend( marker.latLng );
			        }
			    }
			    
			    if ( _locationMarker ) {
			    	tempBounds.extend( _locationMarker.getPosition() );
			    }
			    
			    if ( !tempBounds.isEmpty() ) {
			    	self.map.fitBounds( tempBounds );
			    }
		    }
		});
    },
    
    handlePreMap: function () {
        var self = this;
        
        this.mapMarkers = [];
        this.mapElement = document.getElementById( "map" );
        
        $_mapWrap.height( window.innerHeight-$_filter.height()-$_header.height() );
        $_mapWrap.css( "margin-top", $_header.height() );
        
        // Needs to be set after map gets its height set
        _scrollAble = document.body.clientHeight-window.innerHeight;
        
        // Listen for maps to be loaded and ready
        window.pdx.maps.onmapsready(function () {
            self.handleMap();
            self.handleGeolocation();
        });
        
        // Close cafes event
        $_cafeClose.on( "click", function ( e ) {
	        $_cafeShowing.removeClass( "active" );
	        
	        for ( var i = 0, len = _roasterCafes[ _currentRoasterId ].length; i < len; i++ ) {
	        	_roasterCafes[ _currentRoasterId ][ i ].setMap( null );
	        }
	        
	        self.map.fitBounds( self.mapBounds.roasters );
                    
            $_roasterMarkers.show();
            
            $_mapWrap.height( $_mapWrap.height()-$_filter.height() );
        });
        
        // Click the roaster you are viewing cafes for
        $_cafeRoaster.on( "click", function ( e ) {
	        e.preventDefault();
	        
	        $( "#"+_currentRoasterId ).click();
        });
    },
    
    handleMap: function () {
        var self = this;
        
        this.mapBounds = {
        	cafes: new google.maps.LatLngBounds(),
	        roasters: new google.maps.LatLngBounds()
        };
        this.map = new google.maps.Map(
        	this.mapElement,
        	window.pdx.maps.settings
        );
             
        if ( !$_roasterItems.length ) {
            return false;
        }
        
        $_roasterItems.each(function ( i ) {
            var roasterData = $( this ).data(),
                roasterPoints = roasterData.latlng,
                roasterId = this.id,
                roasterLatLng,
                roasterMarker,
                $cafes;
            
            try {
                roasterPoints = JSON.parse( roasterPoints );
                
            } catch ( error ) {}
            
            if ( typeof roasterPoints === "object" ) {
                roasterData.api = "/api/roaster/"+roasterId+"/";
                
                roasterLatLng = new google.maps.LatLng( roasterPoints[ 0 ], roasterPoints[ 1 ] );
                roasterMarker = new window.pdx.maps.Marker({
                    latLng: roasterLatLng,
                    map: self.map,
                    markerClass: "marker-roaster",
                    onAddCallback: function ( inst ) {
                        self.handleOnAddRoaster( inst, roasterData );
                    },
                    roasterId: roasterId
                });
                
                self.mapMarkers.push( roasterMarker );
                self.mapBounds.roasters.extend( roasterLatLng );
                
                // Build associative cafes
                $cafes = $( "#roaster-"+roasterId+" .cafe" );
                _roasterCafes[ roasterId ] = [];
                
                $cafes.each(function () {
	                var cafeData = $( this ).data(),
	                	cafePoints = cafeData.latlng,
	                	cafeId = cafeData.id,
	                	cafeLatLng,
	                	cafeMarker;
	                
	                try {
		                cafePoints = JSON.parse( cafePoints );
		                
	                } catch ( error ) {}
	                
	                if ( typeof cafePoints === "object" ) {
	                	cafeData.api = "/api/cafe/"+cafeId+"/";
	                	
	                	cafeLatLng = new google.maps.LatLng( cafePoints[ 0 ], cafePoints[ 1 ] );
		                cafeMarker = new window.pdx.maps.Marker({
		                    cafeId: cafeId,
		                    latLng: cafeLatLng,
		                    markerClass: "marker-cafe",
		                    onAddCallback: function ( inst ) {
		                        self.handleOnAddCafe( inst, cafeData );
		                    }
		                });
		                
		                _roasterCafes[ roasterId ].push( cafeMarker );
	                }
                });
            }
        });
        
        this.map.fitBounds( this.mapBounds.roasters );
        
        // Store DOMCollection of roaster markers
        setTimeout(function () {
        	$_roasterMarkers = $( ".marker-roaster" );
        	
        }, 500  );
        
        $_mapWrap.on( "click", function ( e ) {
	        var $target = $( e.target );
	        
	        console.log( $target.closest( ".marker-custom" ).length );
	        
	        if ( !$target.closest( ".marker-custom" ).length && $_currentInfowindow ) {
	        	$_currentInfowindow.addClass( "inactive" );
	        	$_currentInfowindow = null;
	        }
        });
    },
    
    handleOnAddCafe: function ( instance, data ) {
	    var self = this,
            $instance = $( instance.element ),
            $tip = $instance.find( ".tooltip" ),
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
        
        $instance.on( "click", "> div", function ( e ) {
            var $elem = $( this );
            
            $( ".marker-cafe" ).removeClass( "active" );
            $( ".marker-cafe > .infowindow" ).addClass( "inactive" );
            
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
            
            $.ajax({
                url: data.api,
                type: "json",
                data: {
                    format: "json"
                }
            })
            .then(function ( response ) {
	            var html = window.pdx.templates.cafeInfo( response );
                
                clearTimeout( timeout );
                
                instance.loaded = true;
                
                $infowindow = $( "<span>" ).addClass( "infowindow" ).hide();
                
                instance.infowindow = $infowindow[ 0 ];
                
                $infowindow.html( html )
                    .insertAfter( $tip )
                    .css( "top", -($infowindow.height() + 20) )
                    .css( "left", -(($infowindow.width()/2)-($elem.width()/2)) );
                
                // Slight delay for loadout
                setTimeout(function () {
                    $infowindow.show().removeClass( "loading" );
                    
                    $instance.addClass( "loaded" )
                        .addClass( "active" );
                    
                    instance.panMap();
                    
                }, _pushDuration );
            })
            .fail(function ( error, message ) {
	            clearTimeout( timeout );
                    
                console.log( "Infowindow load error" );
            });
        });
    },
    
    handleOnAddRoaster: function ( instance, data ) {
        var self = this,
            $instance = $( instance.element ),
            $tip = $instance.find( ".tooltip" ),
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
            
            $( ".marker-roaster" ).removeClass( "active" );
            $( ".marker-roaster > .infowindow" ).addClass( "inactive" );
            
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
                
                $_currentInfowindow = $infowindow;
                
                return false;
            }
            
            $tip.addClass( "loading" );
            
            $.ajax({
                url: data.api,
                type: "json",
                data: {
                    format: "json"
                }
            })
            .then(function ( response ) {
	            var html = window.pdx.templates.roasterInfo( response );
                
                clearTimeout( timeout );
                
                instance.loaded = true;
                
                $infowindow = $( "<span>" ).addClass( "infowindow" ).hide();
                
                $_currentInfowindow = $infowindow;
                
                instance.infowindow = $infowindow[ 0 ];
                
                $infowindow.html( html )
                    .insertAfter( $tip )
                    .css( "top", -($infowindow.height() + 20) )
                    .css( "left", -(($infowindow.width()/2)-($elem.width()/2)) );
                
                if ( !_roasterCafes[ instance.roasterId ].length ) {
                	$infowindow.find( ".find" ).closest( ".col" ).remove();
                	
                } else {
	                $infowindow.find( ".find" ).on( "click", function ( e ) {
	                    e.preventDefault();
	                    
	                    _currentRoasterId = instance.roasterId;
	                    
	                    self.mapBounds.cafes = new google.maps.LatLngBounds();
	                    
	                    for ( var i = 0, len = _roasterCafes[ instance.roasterId ].length; i < len; i++ ) {
	                    	_roasterCafes[ instance.roasterId ][ i ].setMap( self.map );
	                    	
	                    	self.mapBounds.cafes.extend( _roasterCafes[ instance.roasterId ][ i ].getPosition() );
	                    }
	                    
	                    if ( _locationMarker ) {
	                    	self.mapBounds.cafes.extend( _locationMarker.getPosition() );
	                    	self.map.fitBounds( self.mapBounds.cafes );
	                    	
	                    } else if ( _roasterCafes[ instance.roasterId ].length === 1 ) {
		                    self.map.setCenter( _roasterCafes[ instance.roasterId ][ 0 ].getPosition() );
		                    self.map.setZoom( 15 );
		                    
	                    } else {
		                    self.map.fitBounds( self.mapBounds.cafes );
	                    }
	                    
	                    $_roasterMarkers.hide();
	                    
	                    $_cafeRoaster.text( data.name );
	                    
	                    $_cafeShowing
	                    	.css( "margin-left", -($_cafeShowing.width()/2) )
	                    	.addClass( "active" );
	                    	
	                    //$_mapWrap.trigger( "click" );
	                    
	                    $_mapWrap.height( $_mapWrap.height()+$_filter.height() );
	                });
                }
                
                $infowindow.find( ".more" ).on( "click", function ( e ) {
                    e.preventDefault();
                    
                    $( this.hash ).click();
                });
                
                // Slight delay for loadout
                setTimeout(function () {
                    $infowindow.show().removeClass( "loading" );
                    
                    $instance.addClass( "loaded" )
                        .addClass( "active" );
                    
                    instance.panMap();
                    
                }, _pushDuration );
            })
            .fail(function ( error, message ) {
	            clearTimeout( timeout );
                    
                console.log( "Infowindow load error" );
            });
        });
    },
    
    handleRoasters: function () {
        var self = this,
        	timeout;
        
        $_logo.on( "click", function ( e ) {
            e.preventDefault();
            
            if ( !$_logo.is( ".page-back" ) ) {
            	return false;
            }
            
            $_logo.removeClass( "page-back" );
            
            timeout = setTimeout(function () {
            	clearTimeout( timeout );
            	
            	$.scrollTo( 0 );
            				
            }, _pushDuration );
            
            _pushState.pop();
        });
        
        $_pushPage.on( "click", ".back-to-list", function ( e ) {
	        e.preventDefault();
	        
	        $_logo.removeClass( "page-back" );
            
            _pushState.pop();
        });
        
        $_roasterItems.on( "click", function ( e ) {
            e.preventDefault();
            
            var $elem = $( this ),
                $toggle = $elem.find( ".toggle" ),
                $roaster = $( "#roaster-"+this.id ),
                pageTitle = $roaster.find( ".roaster-title" ).text();
            
            $_pushPage.find( ".content" ).removeClass( "active" );
            
            $roaster.addClass( "active" );
            
            $_logo.addClass( "page-back" );
            
            $_roasterTogs.removeClass( "active" );
            $_roasterItems.removeClass( "active" );
            
            $_content.addClass( "inactive" );
            $_pushPage.addClass( "active" );
            
            _pushState.push( this.href );
            
            // Update document data
            document.title = window.pdx.documentTitle( pageTitle );
            
            // Track pushstate page views
            if ( typeof ga === "function" ) {
            	ga( "send", "pageview", {
	            	page: this.href,
	            	title: pageTitle,
	            	hitCallback: function () {
		            	console.log( "ga hitCallback: ", arguments );
	            	}
            	});
            }
            
            _pagePosition = $_window.scrollTop();
            
            timeout = setTimeout(function () {
            	clearTimeout( timeout );
            	
            	$_content.hide();
            	$_pushPage.addClass( "active-page" );
            	
            	window.scrollTo( 0, 0 );
            				
            }, _pushDuration );
        });
    }
};

// Global handlers
_pushState.onpop(function () {
    $_content.show();
    window.scrollTo( 0, _pagePosition );
    $_pushPage.removeClass( "active" )
    	.removeClass( "active-page" );
    $_content.removeClass( "inactive" );
    document.title = window.pdx.documentTitle( _homePageTitle );
});

$_window.on( "resize", function () {
	$_mapWrap.height( window.innerHeight-$_filter.height()-$_header.height() );
});

})( ender, window );