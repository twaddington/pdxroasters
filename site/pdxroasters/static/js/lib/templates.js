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
    infowindow: function ( view ) {
        var html = "";
        
        html = '<h3>'+view.name+'</h3>';
        html += '<div class="group">';
            html += '<div class="col col1of2">';
                html += '<div class="ci">'+view.address+'</div>';
            html += '</div>';
            html += '<div class="col col1of2">';
                html += '<p class="hours ci">';
                    html += 'TBD:HOURS';
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
    }
}

})( ender, window );