/**
 * PDX Roaster Pushstate Javascript
 *
 * @dependencies:
 * /static/js/pdx.js
 *
 */
(function ( $, window, undefined ) {

// Have 1 popstate event bound
// Decide which instance to call based on state object ?

"use strict";

// Closure globals
var Class = require( "Class" ),
	PushState,
	_counter = 0,
	_instances = {};

window.onpopstate = function ( e ) {
    var instance;
    
    if ( e.state ) {
    	instance = _instances[ e.state.iid ];
    	
    	instance.lastState = instance.state;
        instance.state = e.state;
        
        instance._pop();
    }
};

// PushState Class
window.pdx.pushstate = function ( options ) {
	var id = _counter++,
		instance = new PushState( options, id );
		
	_instances[ id ] = instance;
	
	return instance;
};

PushState = Class.extend({
    init: function ( options, id ) {
        this.cache = {};
        this.poppable = false;
        this.pushable = ("history" in window && "pushState" in window.history);
        this.uid = 0;
        this.id = id;
        
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
                uid: this.uid++,
                iid: this.id
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
        console.log( arguments );
        
        if ( typeof callback === "function" ) {
            this.callbacks[ event ].push( callback );
        }
    },
    
    _call: function ( event ) {
        var args = [].slice.call( arguments, 1 );
        
        for ( var i = 0, len = this.callbacks[ event ].length; i < len; i++ ) {
            this.callbacks[ event ][ i ].apply( null, [this.state] );
        }
    }
});

})( ender, window );