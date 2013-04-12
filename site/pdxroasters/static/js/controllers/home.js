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
    $_mapWrap = $( "#map-wrap" ),
    $_filter = $( "#filter > input" ),
    $_header = $( "#header" ),
    $_content = $( "#content" ),
    $_pushPage = $( "#roaster-push-page" ),
    $_pushRoaster = $_pushPage.find( ".roaster" ),
    $_roasters = $( "#roasters" ),
    $_logo = $( "#logo" ),
    $_roasterItems = $_roasters.find( ".push-link" ),
    $_roasterTogs = $_roasters.find( ".toggle" ),
    $_roasterHandles = $_roasters.find( ".handle" ),
    _pagePosition = 0,
    _pushState = new window.pdx.PushState( {async: false} ),
    _pushDuration = 300,
    
    _testItems = [],
    _testMarkers = [];

// Home Controller
window.pdx.app.home = {
    init: function () {
        var self = this;
        
        this.handlePreMap();
        this.handleRoasters();
        this.handleFilter();
        
        // Global nav module
        window.pdx.nav.init();
    },
    
    handleFilter: function () {
	    var self = this,
	    	current = -1,
	    	lastKey;
	    
	    $_filter.on( "focus", function () {
	    	current = -1;
	    	
		    $.scrollTo( $_filter.offset().top-$_header.height()-(window.innerHeight/2) );
		    
		    $_roasters.css( "min-height", window.innerHeight-$_header.height() );
	    })
	    .on( "blur", function () {
	    	current = -1;
	    	
		    //$_roasterItems.removeClass( "s-hidden" );
		    //$( ".s-focused" ).removeClass( "s-focused" );
		    
		    //$_filter.val( "" );
		    
		    //$.scrollTo( 0 );
	    })
	    .on( "keyup", function ( e ) {
		    var value = this.value,
		    	regex = new RegExp( "^"+value, "i" ),
		    	tempBounds = new google.maps.LatLngBounds(),
		    	filtered = [],
		    	$focused;
		    
		    // Show all items in the list
		    if ( !value.length ) {
		    	current = -1;
		    	
		    	$_roasterItems.removeClass( "s-hidden" );
		    	$( ".marker-custom" ).removeClass( "s-hidden" );
		    	$( ".s-focused" ).removeClass( "s-focused" );
		    	
		    	self.map.fitBounds( self.mapBounds );
		    
		    // We can filter the list
		    } else {
				$_roasterItems.each(function ( item, i ) {
			        var $this = $( this ),
			            name = $this.data( "name" );
			        
			        if ( value !== "" && !regex.exec( name ) ) {
			        	$this.addClass( "s-hidden" );
			        	
			        } else {
				        $this.removeClass( "s-hidden" );
				        
				        filtered.push( this );
			        }
			    });
			    
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
			    
			    if ( !tempBounds.isEmpty() ) {
			    	self.map.fitBounds( tempBounds );
			    }
		    }
		    
		    if ( e.keyCode === 38 || e.keyCode === 40 ) {
		    	// Down
		    	if ( e.keyCode === 40 ) {
		    		if ( current !== filtered.length-1 ) {
		    			current++;
		    		}
		    	
		    	// Up	
		    	} else {
			    	if ( current !== 0 ) {
			    		current--;
			    	}
		    	}
		    	
		    	$( ".s-focused" ).removeClass( "s-focused" );
		    	$( filtered[ current ] ).find( ".handle" ).addClass( "s-focused" );
		    }
		    
		    // Enter
		    if ( e.keyCode === 13 ) {
		    	$focused = $( ".s-focused" );
		    	
		    	if ( $focused.length ) {
		    		$focused.click();
		    	}
		    }
		});
    },
    
    handlePreMap: function () {
        var self = this;
        
        this.mapMarkers = [];
        this.mapElement = document.getElementById( "map" );
        
        $_mapWrap.height( window.innerHeight-$_filter.height() );
        
        // Listen for maps to be loaded and ready
        window.pdx.maps.onmapsready(function () {
            self.handleMap();
        });
    },
    
    handleMap: function () {
        var self = this;
        
        this.mapBounds = new google.maps.LatLngBounds();
        this.map = new google.maps.Map(
        	this.mapElement,
        	window.pdx.maps.settings
        );
             
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
                                self.handleOnAddMarker( inst, data );
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
                    
                } catch ( error ) {}
                
                if ( typeof points === "object" ) {
                    latLng = new google.maps.LatLng( points[ 0 ], points[ 1 ] );
                    marker = new window.pdx.maps.Marker({
                        latLng: latLng,
                        map: self.map,
                        onAddCallback: function ( inst ) {
                            self.handleOnAddMarker( inst, data );
                        }
                    });
                    
                    self.mapMarkers.push( marker );
                    self.mapBounds.extend( latLng );
                }
            }
        });
        
        this.map.fitBounds( this.mapBounds );
    },
    
    handleOnAddMarker: function ( instance, data ) {
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
                    
                }, _pushDuration );
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
                        
                        _pushState.push( this.href, function ( res ) {
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
                        
                    }, _pushDuration );
                }
            });
        });
    },
    
    handleRoasters: function () {
        var self = this;
        
        $_logo.on( "click", function ( e ) {
            e.preventDefault();
            
            if ( !$_logo.is( ".page-back" ) ) {
            	return false;
            }
            
            $_logo.removeClass( "page-back" );
            
            _pushState.pop();
        });
        
        $_roasterItems.on( "click", function ( e ) {
            e.preventDefault();
            
            var $elem = $( this ),
                $toggle = $elem.find( ".toggle" ),
                $roaster = $( "#roaster-"+this.id );
            
            $_pushPage.find( ".content" ).removeClass( "active" );
            
            $roaster.addClass( "active" );
            
            $_logo.addClass( "page-back" );
            
            $_roasterTogs.removeClass( "active" );
            $_roasterItems.removeClass( "active" );
            
            $_content.addClass( "inactive" );
            $_pushPage.addClass( "active" );
            
            _pushState.push( this.href );
            
            setTimeout(function () {
            	_pagePosition = $_window.scrollTop();
            	window.scrollTo( 0, 0 );
            	$_content.hide();
            	$_pushPage.addClass( "active-page" );
            				
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
});

window.onresize = function () {
	$_mapWrap.height( window.innerHeight-$_filter.height() );
};

})( ender, window );