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

        html += '<a href="#'+view.id+'" class="find"></a>';
        html += '<h3>'+view.name+'</h3>';
        html += '<a href="#'+view.id+'" class="more"></a>';

        return html;
    },

    cafeInfo: function ( view ) {
        var html = "";

        html = '<h3>'+view.name+'</h3>';
        if ( window.pdx.maps.location.isset ) {
        	html += '<a href="'+window.pdx.maps.url+'?daddr='+view.lat+','+view.lng+'&saddr='+window.pdx.maps.location.lat+','+window.pdx.maps.location.lng+'" class="btn more" target="_blank">Get Directions</a>';

        } else {
            html += '<a href="'+window.pdx.maps.url+'?daddr='+view.lat+','+view.lng+'" class="btn more" target="_blank">Get Directions</a>';
        }

        return html;
    }
}

})( ender, window );