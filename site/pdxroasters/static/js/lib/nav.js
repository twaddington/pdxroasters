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
        this.isPopStateEvent = false;
        this.isOnLoad = true;
        this.pushState = window.pdx.pushstate({
	        async: false
        });
        
        this.pushState.onpop(function ( state ) {
        	if ( self.isOnLoad ) {
        		self.isOnLoad = false;
        		return;
        	}
        	
        	self.isPopStateEvent = true;
        	
        	var path = state.to
        		.replace( location.protocol, "" )
        		.replace( location.host, "" )
        		.replace( /\//g, "" );
        	
        	if ( path === "" && !self.isOnLoad ) {
        		self.$navTog.click();
        		
        	} else {
	        	self.$nav.find( "[href*='"+path+"']" ).click();
        	}
        	
        	self.isPopStateEvent = false;
        });
        
        this.$navTog.on( "click", function ( e ) {
            e.preventDefault();
            
            self.$navTog.toggleClass( "active" );
            self.$nav.toggleClass( "active" );
            
            if ( !self.$navTog.is( ".active" ) ) {
            	self.$pushPage.removeClass( "active" );
            	
            } else {
                //$( "[data-page='"+self.activePage+"']" ).click();
            }
            
            self.pushState.push( "/" );
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
            
            if ( !self.isPopStateEvent ) {
            	self.pushState.push( this.href );
            }
        });
	}
}

})( ender, window );