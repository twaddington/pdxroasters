define(["jquery"], function ($) {

  var about = document.getElementById("about");
  var aboutLink = document.getElementById("about_link");
  var mapLink = document.getElementById("map_link");
  var aboutOffset = about.offsetTop;
  var win = document.body.scrollTop;
  var height = window.innerHeight;
  var aboutActive = false;

  var Scroll = {
    init: function() {
      if (about){
        window.onscroll = function () {
          win = document.body.scrollTop;
          if (win > aboutOffset - height / 2 && aboutActive === false){
            Scroll.aboutActivate();
          }
          if (win < aboutOffset - height / 2 && aboutActive === true){
            Scroll.mapActivate();
          }
        };
        window.onresize = function(event) {
          height = window.innerHeight;
        };
      }
    },
    aboutActivate: function(){
      aboutLink.className += " active";
      mapLink.className = "nav-right";
      aboutActive = true;
    },
    mapActivate: function(){
      mapLink.className += " active";
      aboutLink.className = "nav-right";
      aboutActive = false;
    }
  };

  return Scroll;

});