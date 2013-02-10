/**
 * PDX Roaster Map Styles Object
 *
 * @dependencies:
 * /static/js/pdx.js
 *
 */
(function () {

"use strict";

window.pdx.mapstyles = [
	{
		"featureType": "water",
		"elementType": "geometry.fill",
		"stylers": [
			{ "visibility": "on" },
			{ "color": "#c4d3d8" }
		]
	},
	{
		"featureType": "road",
		"elementType": "geometry.fill",
		"stylers": [
			{ "color": "#ffffff" },
			{ "visibility": "on" }
		]
	},
	{
		"featureType": "landscape.man_made",
		"stylers": [
			{ "visibility": "on" },
			{ "color": "#e7e4d9" }
		]
	},
	{
		"featureType": "poi.park",
		"elementType": "geometry.fill",
		"stylers": [
			{ "visibility": "on" },
			{ "color": "#c2dc96" }
		]
	},
	{
		"featureType": "road",
		"elementType": "labels.text.fill",
		"stylers": [
			{ "color": "#adafae" },
			{ "visibility": "on" }
		]
	},
	{
		"featureType": "road.arterial",
		"elementType": "labels.text.stroke",
		"stylers": [
			{ "weight": 1.6 },
			{ "visibility": "on" },
			{ "color": "#f9f6ed" }
		]
	},
	{
		"featureType": "road.arterial",
		"elementType": "labels.text.fill",
		"stylers": [
			{ "color": "#aeaead" }
		]
	},
	{
		"featureType": "poi",
		"elementType": "labels",
		"stylers": [
			{ "visibility": "off" }
		]
	},
	{
		"featureType": "transit",
		"elementType": "labels.icon",
		"stylers": [
			{ "visibility": "off" }
		]
	},{
		"featureType": "road.highway",
		"elementType": "labels.icon",
		"stylers": [
			{ "visibility": "off" }
		]
	},
	{
		"featureType": "road.arterial",
		"elementType": "geometry.stroke",
		"stylers": [
			{ "visibility": "on" },
			{ "color": "#c8c9c9" }
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "geometry.stroke",
		"stylers": [
			{ "visibility": "on" },
			{ "color": "#c1c2c2" }
		]
	},
	{
		"featureType": "road.local",
		"elementType": "labels.text.fill"  },{
		"featureType": "road.local",
		"elementType": "labels.text.fill",
		"stylers": [
			{ "color": "#bebab4" }
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "labels.text.stroke",
		"stylers": [
			{ "color": "#fffffe" }
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "labels.text.fill",
		"stylers": [
			{ "color": "#898c8c" }
		]
	},
	{
		"featureType": "road.arterial",
		"elementType": "labels.text.fill",
		"stylers": [
			{ "color": "#969694" }
		]
	},
	{
		"featureType": "transit.line",
		"elementType": "geometry.fill",
		"stylers": [
			{ "lightness": 9 },
			{ "visibility": "on" },
			{ "color": "#8f908d" }
		]
	},
	{
		"featureType": "administrative.land_parcel",
		"elementType": "geometry.stroke",
		"stylers": [
			{ "color": "#d6d2cc" }
		]
	},
	{
		"featureType": "poi.sports_complex",
		"elementType": "geometry.fill",
		"stylers": [
			{ "color": "#ccd89d" }
		]
	},
	{
		"featureType": "administrative",
		"elementType": "labels.text.fill",
		"stylers": [
			{ "color": "#9e9a97" },
			{ "visibility": "off" }
		]
	},
	{
		"featureType": "administrative",
		"elementType": "labels.text.stroke",
		"stylers": [
			{ "visibility": "off" }
		]
	},
	{
		"featureType": "transit",
		"elementType": "labels.text",
		"stylers": [
			{ "color": "#6c9e85" },
			{ "visibility": "off" }
		]
	}
];

})();