define(["jquery"], function ($) {

  var about = document.getElementById("about");
  var aboutLink = document.getElementById("about_link");
  var mapLink = document.getElementById("map_link");
  var aboutOffset = about.offsetTop;
  var win = document.body.scrollTop;
  var height = window.innerHeight;
  var aboutActive = false;
  var timeout;

  var Scroll = {
    init: function() {
      if (about){
        window.onscroll = function () {
          win = document.body.scrollTop;
          if (win > aboutOffset - height / 2 && aboutActive === false){
            Scroll.activate(aboutLink, mapLink, true);
          }
          if (win < aboutOffset - height / 2 && aboutActive === true){
            Scroll.activate(mapLink, aboutLink, false);
          }
        };
        window.onresize = function(event) {
          height = window.innerHeight;
        };
      }
    },
    activate: function(active, inactive, status){
      active.className += " active";
      inactive.className = "nav-right";
      aboutActive = status;
    },
    scrollTo: function(y){
      if (document.body.scrollTop !== 0 || document.documentElement.scrollTop !== 0){
        window.scrollBy(0,-50);
        timeOut=setTimeout('scrollToTop()',10);
      } else {
        clearTimeout(timeOut);
      }
    }
  };

  return Scroll;

});