/**
 * PDX Roaster Pushstate Javascript
 *
 * @dependencies:
 * /static/js/ender/*
 * /static/js/pdx.js
 *
 */
(function () {

// Pushstate namespace
window.pdx.pushstate = function () {
    if ( !(this instanceof window.pdx.pushstate) ) {
    	return new window.pdx.pushstate();
    }
    
    this.state;
    this.cache = {};
    this.poppable = false;
    this.able = (window.history && window.history.pushState);
    
    // Enable the popstate event
    this._popEnable();
};

window.pdx.pushstate.prototype = {
    push: function ( url, callback ) {
        var self = this;
        
        this._get( url, function ( res ) {
            if ( typeof callback === "function" ) {
            	callback( res );
            }
            
            if ( self.able ) {
            	window.history.pushState( {}, "", url );
            	
            	// Cache that shit
            	self.cache[ url ] = res;
            }
        });
    },
    
    _get: function ( url, callback ) {
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
        if ( !this.able || this.poppable ) {
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

})();