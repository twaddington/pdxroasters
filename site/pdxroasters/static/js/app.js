/**
 * PDX Roaster Application Contoller
 *
 */
(function ( $, window ) {

"use strict";


// Mobile support
var _mobile = window.pdx.support.mobile,
	
	// Vendor prefix
	_prefix = window.pdx.support.prefix,
	
	// CSS style shortcut
	_cssTransform = _prefix+"Transform",
	_scaleStyle = "scale(.9)",
	_transitionDelay = 200,
	
	// Will reserve applicational methods
	_app = {},
	
	// Will be google.maps.Map instance
	_map,
	
	// DOMCollections
	$_navi = $( "nav a" ),
	$_views = $( ".view" ),
	$_map = $( "#map" );


/******************************************************************************
 * Practical Application
*******************************************************************************/
_app.translateViews = function ( $viewIn, $viewOut ) {
	var isAdvance = ($viewIn.index() > $viewOut.index()),
		timeout;
	
	_app.stageView( $viewIn, isAdvance );
	
	$viewOut.addClass( "view-translating" );
	
	$viewOut[ 0 ].style[ _cssTransform ] = _scaleStyle;
	
	timeout = setTimeout(function () {
		clearTimeout( timeout );
		
		$viewIn.addClass( "view-translating" );
		
		timeout = setTimeout(function () {
			clearTimeout( timeout );
			
			if ( isAdvance ) {
				$viewOut[ 0 ].style[ _cssTransform ] = "translate3d(0,-110%,0) "+_scaleStyle;
				$viewIn[ 0 ].style[ _cssTransform ] = "translate3d(0,0,0) "+_scaleStyle;
				
			} else {
				$viewOut[ 0 ].style[ _cssTransform ] = "translate3d(0,110%,0) "+_scaleStyle;
				$viewIn[ 0 ].style[ _cssTransform ] = "translate3d(0,0,0) "+_scaleStyle;
			}
			
			timeout = setTimeout(function () {
				clearTimeout( timeout );
				
				$viewOut[ 0 ].style[ _cssTransform ] = "scale(1)";
				$viewIn[ 0 ].style[ _cssTransform ] = "scale(1)";
				
				$viewOut.removeClass( "view-static view-translating" );
				$viewIn.removeClass( "view-translating" );
				$viewIn.addClass( "view-static" );
							
			}, _transitionDelay );
						
		}, _transitionDelay );
		
	}, _transitionDelay );
};

_app.stageView = function ( $view, isAdvance ) {
	var styles = [ _scaleStyle ],
		timeout;
	
	if ( isAdvance ) {
		styles.push( "translate3d(0,110%,0)" );
		
	} else {
		styles.push( "translate3d(0,-110%,0)" );
	}
	
	$view[ 0 ].style[ _cssTransform ] = styles.join( " " );
};


/******************************************************************************
 * Event Delegation ( elements live/die )
*******************************************************************************/


/******************************************************************************
 * Event Binding ( elements persistent )
*******************************************************************************/
$_navi.on( "click", function ( e ) {
	e.preventDefault();
	
	var $viewIn = $( this.hash ),
		$viewOut = $( ".view-static" );
	
	if ( $viewIn.is( ".view-static" ) ) {
		return false;
	}
	
	_app.translateViews( $viewIn, $viewOut );
});


/******************************************************************************
 * Party like a Ho ( start this up )
*******************************************************************************/
(function init() {
	window.pdx.maps.onmapsready(function () {
		_map = new google.maps.Map( $_map[ 0 ], window.pdx.maps.settings );
	});
})();


})( ender, window );