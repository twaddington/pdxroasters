/**
 * PDX Roaster Pushstate Javascript
 *
 * @dependencies:
 * /static/js/ender/*
 * /static/js/pdx.js
 *
 */
(function ( window, undefined ) {

// Pushstate namespace
window.pdx.pushstate = function () {
    if ( !(this instanceof window.pdx.pushstate) ) {
    	return new window.pdx.pushstate();
    }
    
    this.state;
    this.from;
    this.on;
    this.cache = {};
    this.poppable = false;
    this.pushable = ("history" in window && "pushState" in window.history);
    
    // Enable the popstate event
    this._popEnable();
};

window.pdx.pushstate.prototype = {
    push: function ( url, callback ) {
        var self = this;
        
        // Keep track of where we came from when pushing
        this.from = window.location.href;
        
        // And where we are going to be afterwards
        this.on = url;
        
        if ( typeof this.before === "function" ) {
        	this.before();
        }
        
        this._get( url, function ( res ) {
            if ( typeof callback === "function" ) {
            	callback( res );
            }
            
            if ( self.pushable ) {
            	window.history.pushState( {}, "", url );
            }
            
            if ( typeof self.after === "function" ) {
            	self.after( res );
            }
            
            // Cache that shit
            self.cache[ url ] = res;
        });
    },
    
    _get: function ( url, callback ) {
        // Pull from cache if we can
        if ( this.cache[ url ] ) {
        	if ( typeof callback === "function" ) {
        		callback( this.cache[ url ] );
        	}
        	
        	return false;
        }
        
        $.ajax({
            url: url,
            type: "json",
            error: function ( xhr ) {
                var err = {
                    text: xhr.statusText,
                    code: xhr.status,
                    error: true
                }
                
                if ( typeof callback === "function" ) {
                	callback( err );
                }
            },
            success: function ( res ) {
                if ( typeof callback === "function" ) {
                	callback( res );
                }
            }
        });
    },
    
    _popEnable: function () {
        if ( !this.pushable || this.poppable ) {
        	return false;
        }
        
        var self = this;
        
        // Popping
        this.poppable = true;
        
        // Add the handler
        window.onpopstate = function ( e ) {
            self.state = e.state;
        };
    }
}

})( window );