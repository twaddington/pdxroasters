/**
 * PDX Roaster Templates
 *
 */
(function ( $, window, undefined ) {

"use strict";

// Templates namespace
window.pdx.templates = {
    _trim: function ( html ) {
		return html.replace( /\{\{\s/g, "{{" ).replace( /\s\}\}/g, "}}" );
	},
	
	// Handles top-level object properties only
	render: function ( html, data ) {
		var ret = this._trim( html );
		
		for ( var i in data ) {
			var regex = new RegExp( "\{\{"+i+"\}\}", "g" );
			
			ret = ret.replace( regex, data[ i ] );
		}
		
		return ret;
	},
    
    roasterInfo: function ( data ) {
        var html = "";
        
        if ( view.cafes.length ) {
            html += '<a href="#{{ id }}" class="find"></a>';
        }
        
        html += '<h3>{{ name }}</h3>';
        html += '<a href="#{{ id }}" class="more"></a>';
        html += '<p>{{ address }}</p>';

        return this.render( html, data );
    },

    cafeInfo: function ( data ) {
        var html = "";

        html = '<h3>{{ name }}</h3>';
        
        if ( window.pdx.maps.location.isset ) {
        	html += '<a href="'+window.pdx.maps.url+'?daddr={{ lat }},{{ lng }}&saddr={{ lat }},{{ lng }}" class="btn more" target="_blank">Get Directions</a>';

        } else {
            html += '<a href="'+window.pdx.maps.url+'?daddr={{ lat }},{{ lng }}" class="btn more" target="_blank">Get Directions</a>';
        }

        return this.render( html, data );
    }
}

})( ender, window );