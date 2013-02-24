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
        	to: window.location.href,
        	uid: this.uid++
        };
        this.states.push( this.state );
        
        // Configurable options
        this.async = ( options.async !== undefined ) ? options.async : true;
        this.caching = ( options.caching !== undefined ) ? options.caching : true;
        
        // Enable the popstate event
        this.callbacks = {
	        pop: [],
	        before: [],
	        after: []
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
        
        this._call( "before" );
        
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
	            
	            self._call( "after", res );
	            
	            // Cache that shit
	            if ( self.caching ) {
	            	self.cache[ url ] = res;
	            }
	        });
        	
        } else {
	        if ( this.pushable ) {
            	window.history.pushState( state, "", url );
            	
            	this.states.push( state );
            	
            	this._call( "after" );
            }
        }
    },
    
    before: function ( callback ) {
	    this._add( "before", callback );
    },
    
    after: function ( callback ) {
	    this._add( "after", callback );
    },
    
    onpop: function ( callback ) {
	    this._add( "pop", callback );
    },
    
    pop: function () {
	    window.history.back();
	    
	    this._pop();
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
        // Use ender here so we can bind multiple
        // instances of the popstate handler
        $( window ).on( "popstate", function ( e ) {
            if ( !e.state ) {
            	self.lastState = undefined;
            	self.state = self.state;
            	
            } else {
	            self.lastState = self.state;
            	self.state = e.state;
            }
            
            self._pop();
        });
    },
    
    _pop: function () {
	    var backward,
	    	forward;
	    
	    if ( !this.lastState || (this.state.uid < this.lastState.uid) ) {
	    	backward = true;
	    	forward = false;
	    	
	    } else {
		    backward = false;
	    	forward = true;
	    }
	    
	    this._call( "pop" );
    },
    
    _add: function ( event, callback ) {
	    if ( typeof callback === "function" ) {
	    	this.callbacks[ event ].push( callback );
	    }
    },
    
    _call: function ( event ) {
	    var args = [].slice.call( arguments, 1 );
	    
	    for ( var i = 0, len = this.callbacks[ event ].length; i < len; i++ ) {
        	this.callbacks[ event ][ i ].apply( null, args );
        }
    }
});

})( ender, window );