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
var $_document = $( document ),
    $_body = $( document.body ),
    $_window = $( window ),
    $_content = $( "#content" ),
    $_pushPage = $( "#nav-push-page" ),
    $_nav = $( "#nav" ),
    $_navTog = $_nav.find( ".plus" ),
    $_navLinks = $_nav.find( "a:not(.plus)" ),
    _lastOpenPage = null,
    _pagePosition = 0,
    _isPushPageOpen = false;

window.pdx.nav = {
	init: function () {
		var self = this;
		
		//$_pushPage.height( window.innerHeight );
		
		//$_window.on( "resize", function () {
		//	$_pushPage.height( window.innerHeight );
		//});
        
        $_navTog.on( "click", function ( e ) {
            e.preventDefault();
            
            $_navTog.toggleClass( "active" );
            $_nav.toggleClass( "active" );
            
            // Closing
            if ( !$_navTog.is( ".active" ) ) {
            	$_content.show();
            	window.scrollTo( 0, _pagePosition );
            	$_content.removeClass( "inactive" );
            	$_pushPage.removeClass( "active" );
            	$_navLinks.removeClass( "on" );
            	_isPushPageOpen = false;
            }
        });
        
        $_navLinks.on( "click", function ( e ) {
            e.preventDefault();
            
            if ( !_isPushPageOpen ) {
            	$_pushPage.addClass( "active" );
            	_isPushPageOpen = true;
            }
            
            var $this = $( this ),
            	path = this.href
            		.replace( location.protocol, "" )
            		.replace( location.host, "" )
            		.replace( /\//g, "" ),
            	$page = $( "#"+path );
            
            $_navLinks.removeClass( "on" );
            $this.addClass( "on" );
            
            $_pushPage.find( ".page" ).removeClass( "active" );
            $page.addClass( "active" );
        });
	}
}

})( ender, window );