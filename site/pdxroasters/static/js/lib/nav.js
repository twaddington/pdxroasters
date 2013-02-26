/**
 * PDX Roaster Navigation
 *
 * @dependencies:
 * /static/js/pdx.js
 *
 */
(function ( $, window ) {

"use strict";

window.pdx.nav = {
	init: function () {
		var self = this;
        
        this.$nav = $( "#nav" );
        this.$navTog = this.$nav.find( ".plus" );
        this.$navLinks = this.$nav.find( "a:not(.plus)" );
        this.$pages = $( "#info-pages" );
        this.$activePage;
        this.$lastPage;
        this.activePage;
        this.lastPage;
        this.isPopStateEvent = false;
        this.pushState = new window.pdx.PushState({
	        async: false
        });
        
        this.pushState.onpop(function ( back, forward ) {
        	// Figure this out...
        });
        
        this.$navTog.on( "click", function ( e ) {
            e.preventDefault();
            
            self.$navTog.toggleClass( "active" );
            self.$nav.toggleClass( "active" );
            
            if ( !self.$navTog.is( ".active" ) ) {
            	self.$pages.removeClass( "active" );
            	
            } else {
                $( "[data-page='"+self.activePage+"']" ).click();
            }
            
            self.pushState.push( "/" );
        });
        
        this.$navLinks.on( "click", function ( e ) {
            e.preventDefault();
            
            if ( !self.$pages.is( ".active" ) ) {
            	self.$pages.addClass( "active" );
            }
            
            var $this = $( this ),
            	page = $this.data( "page" );
            
            self.lastPage = self.activePage;
            self.$lastPage = self.$activePage;
            
            self.$navLinks.removeClass( "on" );
            $this.addClass( "on" );
            
            self.$activePage = $( "#"+page );
            self.activePage = page;
            
            if ( self.$lastPage && self.$lastPage.index() > self.$activePage.index() ) {
            	self.$lastPage.css( "left", "100%" );
            	
            } else if ( self.$lastPage && self.$lastPage.index() < self.$activePage.index() ) {
	            self.$lastPage.css( "left", "-100%" );
            }
            
            self.$activePage.css( "left", 0 );
            
            if ( !self.isPopStateEvent ) {
            	self.pushState.push( this.href );
            }
        });
	}
}

})( ender, window );