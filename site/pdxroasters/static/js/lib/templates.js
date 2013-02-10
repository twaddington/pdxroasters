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

// Closure global
var mustache = require( "mustache" );

// Templates namespace
window.pdx.templates = {
    infowindow: function ( view ) {
        var tmpl = "";
        
        tmpl = '<h3>{{ name }}</h3>';
        tmpl += '<div class="group">';
            tmpl += '<div class="col col1of2">';
                tmpl += '<div class="ci">{{ address }}</div>';
            tmpl += '</div>';
            tmpl += '<div class="col col1of2">';
                tmpl += '<p class="hours ci">';
                    tmpl += 'Mon. - Fri. <span>8 - 12</span><br />';
                    tmpl += 'Sat. <span>8 - 12</span><br />';
                    tmpl += 'Sun. <span>8 - 12</span>';
                tmpl += '</p>';
            tmpl += '</div>';
        tmpl += '</div>';
        tmpl += '<div class="btns group">';
            tmpl += '<div class="col col1of2">';
                tmpl += '<div class="ci"><a href="#{{ id }}" class="btn find">Find this Roast</a></div>';
            tmpl += '</div>';
            tmpl += '<div class="col col1of2">';
                tmpl += '<div class="ci"><a href="/roaster/{{ slug }}/" class="btn more">Learn More</a></div>';
            tmpl += '</div>';
        tmpl += '</div>';
        tmpl += '<a href="#close" class="plus-close">Close</div>';
        
        return mustache.render( tmpl, view );
    }
}

})( ender, window );