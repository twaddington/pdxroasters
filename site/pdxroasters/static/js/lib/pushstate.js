/**
 * PDX Roaster Pushstate Javascript
 *
 * @dependencies:
 * /static/js/pdx.js
 *
 */
(function ( $, window, undefined ) {

"use strict";

// Closure globals
var Class = require( "Class" );

// PushState Class
window.pdx.PushState = Class.extend({
    init: function ( options ) {
        this.cache = {};
        this.poppable = false;
        this.pushable = ("history" in window && "pushState" in window.history);
        this.uid = 0;
        
        // Set initial state object
        this.lastState = undefined;
        this.states = [];
        this.state = {
        	from: window.location.href,
        	to:  window.location.href,
        	uid: this.uid++
        };
        this.states.push( this.state );
        
        // Configurable options
        this.async = ( options.async !== undefined ) ? options.async : true;
        this.caching = ( options.caching !== undefined ) ? options.caching : true;
        
        // Enable the popstate event
        this.callbacks = {
	        pop: []
        };
        this._popEnable();
    },
    
    push: function ( url, callback ) {
        var self = this,
        	state = {
        		from: window.location.href,
        		to: url,
        		uid: this.uid++
        	};
        
        this.lastState = this.state;
        this.state = state;
        
        if ( typeof this.before === "function" ) {
        	this.before();
        }
        
        // Are we needing to make a request?
        if ( this.async ) {
        	this._get( url, function ( res ) {
	            if ( typeof callback === "function" ) {
	            	callback( res );
	            }
	            
	            if ( self.pushable ) {
	            	window.history.pushState( state, "", url );
	            	
	            	self.states.push( state );
	            }
	            
	            if ( typeof self.after === "function" ) {
	            	self.after( res );
	            }
	            
	            // Cache that shit
	            if ( self.caching ) {
	            	self.cache[ url ] = res;
	            }
	        });
        	
        } else {
	        if ( this.pushable ) {
            	window.history.pushState( state, "", url );
            	
            	this.states.push( state );
            	
            	if ( typeof this.after === "function" ) {
	            	this.after();
	            }
            }
        }
    },
    
    pop: function () {
	    window.history.back();
	    
	    this._callPops();
    },
    
    onpop: function ( callback ) {
	    if ( typeof callback === "function" ) {
	    	this.callbacks.pop.push( callback );
	    }
    },
    
    _get: function ( url, callback ) {
        // Pull from cache if we can
        if ( this.caching && this.cache[ url ] ) {
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
            if ( !e.state ) {
            	self.lastState = undefined;
            	self.state = self.state;
            	
            } else {
	            self.lastState = self.state;
            	self.state = e.state;
            }
            
            self._callPops();
        };
    },
    
    _callPops: function () {
	    var backward,
	    	forward;
	    
	    if ( !this.lastState || (this.state.uid < this.lastState.uid) ) {
	    	backward = true;
	    	forward = false;
	    	
	    } else {
		    backward = false;
	    	forward = true;
	    }
	    
	    for ( var i = 0, len = this.callbacks.pop.length; i < len; i++ ) {
        	this.callbacks.pop[ i ].call( null, backward, forward );
        }
    }
});

})( ender, window );