/**
 * PDX Roaster Google Analytics
 *
 * @dependencies:
 * /static/js/pdx.js
 *
 */
(function ( $, window, undefined ) {

"use strict";

// Tracking namespace
window.pdx.tracking = {
	UAID: "UA-2012911-16",
	
	init: function () {
		window._gaq = window._gaq || [];
		window._gaq.push(["_setAccount", this.UAID]);
		window._gaq.push(["_trackPageview"]);
		
		(function() {
			var ga = document.createElement("script"); ga.type = "text/javascript"; ga.async = true;
			ga.src = ("https:" == document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js";
			var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ga, s);
		})();
	}
};

// Auto init
window.pdx.tracking.init();

})( ender, window );