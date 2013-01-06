/**
 * PDX Roaster Application Contoller
 *
 * @dependencies:
 * /static/js/vendor/*
 * /static/js/pdx.js
 * /static/js/lib/*
 *
 */
(function () {

// Run controller/utils
var controller = $( document.body ).data( "controller" );

if ( window.pdx.app[ controller ] && window.pdx.app[ controller ].init ) {
	window.pdx.app[ controller ].init();
	window.pdx.utils.init();
}

})();