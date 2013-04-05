/**
 * PDX Roaster Templates
 *
 * @dependencies:
 * /static/js/pdx.js
 *
 * Using Mustache compiled with Ender:
 * https://github.com/janl/mustache.js
 *
 * Mustache methods/properties:
 * name
 * tags
 * version
 * Context
 * Writer
 * Scanner
 * escape
 * parse
 * clearCache
 * compile
 * compilePartial
 * compileTokens
 * render
 * to_html
 *
 */
(function ( $, window, undefined ) {

"use strict";

// Templates namespace
window.pdx.templates = {
    infowindow: function ( view ) {
        var tmpl = "";
        
        tmpl = '<h3>'+view.name+'</h3>';
        tmpl += '<div class="group">';
            tmpl += '<div class="col col1of2">';
                tmpl += '<div class="ci">'+view.address+'</div>';
            tmpl += '</div>';
            tmpl += '<div class="col col1of2">';
                tmpl += '<p class="hours ci">';
                    tmpl += 'TBD:HOURS';
                tmpl += '</p>';
            tmpl += '</div>';
        tmpl += '</div>';
        tmpl += '<div class="btns group">';
            tmpl += '<div class="col col1of2">';
                tmpl += '<div class="ci"><a href="#'+view.id+'" class="btn find">Find this Roast</a></div>';
            tmpl += '</div>';
            tmpl += '<div class="col col1of2">';
                tmpl += '<div class="ci"><a href="/roaster/'+view.slug+'/" class="btn more">Learn More</a></div>';
            tmpl += '</div>';
        tmpl += '</div>';
        tmpl += '<a href="#close" class="plus-close">Close</div>';
        
        return tmpl;
    }
}

})( ender, window );