/**
 * PDX Roaster Templates
 *
 * @dependencies:
 * /static/js/pdx.js
 *
 */
(function ( $, window, undefined ) {

"use strict";

// Templates namespace
window.pdx.templates = {
    roasterInfo: function ( view ) {
        var html = "";
        
        html = '<h3>'+view.name+'</h3>';
        html += '<div class="group">';
            html += '<div class="col col1of2">';
                html += '<div class="ci">'+view.address+'</div>';
            html += '</div>';
            html += '<div class="col col1of2">';
                html += '<p class="hours ci">';
                    html += this._getRoasterHours( view.id );
                html += '</p>';
            html += '</div>';
        html += '</div>';
        html += '<div class="btns group">';
            html += '<div class="col col1of2">';
                html += '<div class="ci"><a href="#'+view.id+'" class="btn find">Find this Roast</a></div>';
            html += '</div>';
            html += '<div class="col col1of2">';
                html += '<div class="ci"><a href="#'+view.id+'" class="btn more">Learn More</a></div>';
            html += '</div>';
        html += '</div>';
        html += '<a href="#close" class="plus-close">Close</div>';
        
        return html;
    },
    
    cafeInfo: function ( view ) {
        var html = "";
        
        html = '<h3>'+view.name+'</h3>';
        html += '<div class="group">';
        	html += '<div class="col col1of2">';
        		html += view.address+'<br />';
        		html += view.phone+'<br />';
        		html += '<a href="'+view.url+'" target="_blank">Website</a>';
        	html += '</div>';
        html += '</div>';
        html += '<div class="btns group">';
        	html += '<div class="col col1of2">';
                html += '<div class="ci">';
                if ( window.pdx.maps.location.isset ) {
                	html += '<a href="'+window.pdx.maps.url+'?daddr='+view.lat+','+view.lng+'&saddr='+window.pdx.maps.location.lat+','+window.pdx.maps.location.lng+'" class="btn more" target="_blank">Get Directions</a>';
                	
                } else {
	                html += '<a href="'+window.pdx.maps.url+'?daddr='+view.lat+','+view.lng+'" class="btn more" target="_blank">Get Directions</a>';
                }
                html += '</div>';
            html += '</div>';
        html += '</div>';
        html += '<a href="#close" class="plus-close">Close</div>';
        
        return html;
    },
    
    _getRoasterHours: function ( id ) {
	    return $( "#roaster-"+id+"-hours" ).html();
    }
}

})( ender, window );