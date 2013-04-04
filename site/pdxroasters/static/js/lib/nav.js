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
    $_content = $( "#content" );

window.pdx.nav = {
	init: function () {
		var self = this;
        
        this.$nav = $( "#nav" );
        this.$navTog = this.$nav.find( ".plus" );
        this.$navLinks = this.$nav.find( "a:not(.plus)" );
        this.$pushPage = $( "#nav-push-page" );
        
        this.$navTog.on( "click", function ( e ) {
            e.preventDefault();
            
            self.$navTog.toggleClass( "active" );
            self.$nav.toggleClass( "active" );
            
            if ( !self.$navTog.is( ".active" ) ) {
            	self.$pushPage.removeClass( "active" );
            	self.$navLinks.removeClass( "on" );
            	
            } else {
                // Open the last one?
            }
        });
        
        this.$navLinks.on( "click", function ( e ) {
            e.preventDefault();
            
            if ( !self.$pushPage.is( ".active" ) ) {
            	self.$pushPage.addClass( "active" );
            }
            
            var $this = $( this ),
            	path = this.href
            		.replace( location.protocol, "" )
            		.replace( location.host, "" )
            		.replace( /\//g, "" ),
            	$page = $( "#"+path );
            
            self.$navLinks.removeClass( "on" );
            $this.addClass( "on" );
            
            self.$pushPage.find( ".page" ).removeClass( "active" );
            $page.addClass( "active" );
        });
	}
}

})( ender, window );