/**
 * PDX Roaster Namespace
 *
 */
(function () {

// Console fallback
window.console = window.console || function () {};

// Create our global namespace
window.pdx = {};

// Application space
window.pdx.app = {};

// Blank utility space
window.pdx.utils = {
    init: function () {
        console.log( "[no utilities defined]" );
    }
};

})();