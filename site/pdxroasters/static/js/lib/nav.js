/**
 * PDX Roaster Navigation
 *
 * @dependencies:
 * /static/js/pdx.js
 *
 */
(function ( $, window ) {

"use strict";

// Closure globals
var $_window = $( window ),
	$_header = $( "#header" ),
	$_content = $( "#content" ),
	$_nav = $( "#nav" ),
    $_navTog = $_nav.find( ".plus" ),
    $_navLinks = $_nav.find( "a:not(.plus)" ),
    $_navPushPage = $( "#nav-push-page" ),
    _isPushPageOpen = false,
    _pushDuration = 300;

window.pdx.nav = {
	init: function () {
		var self = this,
			timeout;
		
		$_navPushPage.css( "min-height", window.innerHeight );
		
		$_navTog.on( "click", function ( e ) {
            e.preventDefault();
            
            $_navTog.toggleClass( "active" );
            $_nav.toggleClass( "active" );
            
            // Closing
            if ( !$_navTog.is( ".active" ) ) {
            	$_content.show();
            	$_navPushPage.removeClass( "active" )
            		.removeClass( "active-page" );
            	$_navLinks.removeClass( "on" );
            	_isPushPageOpen = false;
            	
            } else {
	            
            }
        });
        
        $_navLinks.on( "click", function ( e ) {
            e.preventDefault();
            
            if ( !_isPushPageOpen ) {
            	$_navPushPage.addClass( "active" );
            	_isPushPageOpen = true;
            	
            	timeout = setTimeout(function () {
	            	clearTimeout( timeout );
	            	
	            	$_content.hide();
	            	$_navPushPage.addClass( "active-page" );
	            	
	            	window.scrollTo( 0, 0 );
	            				
	            }, _pushDuration );
            }
            
            var $this = $( this ),
            	path = this.href
            		.replace( location.protocol, "" )
            		.replace( location.host, "" )
            		.replace( /\//g, "" ),
            	$page = $( "#"+path );
            
            $_navLinks.removeClass( "on" );
            $this.addClass( "on" );
            
            $_navPushPage.find( ".page" ).removeClass( "active" );
            $page.addClass( "active" );
        });
	}
};

// Global handlers
$_window.on( "resize", function () {
	$_navPushPage.css( "min-height", window.innerHeight );
});

})( ender, window );