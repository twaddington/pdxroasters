define(["jquery"], function ($) {

  var about       = document.getElementById('about'),
      aboutLink   = document.getElementById('about_link'),
      mapLink     = document.getElementById('map_link'),
      aboutOffset = about.offsetTop,
      win         = document.body.scrollTop,
      height      = window.innerHeight,
      aboutActive = false;

  var Scroll = {
    init: function() {
      if (about){
        if(window.location.href.indexOf("#about") == -1){
          Scroll.activate(mapLink, aboutLink, false);
        }
        if(window.location.href.indexOf("#about") != -1){
          Scroll.activate(aboutLink, mapLink, true);
        }
      }
    },
    smoothScroll: function(){
      $(aboutLink).click(function(e){
        $('body').stop().animate({
            scrollTop: aboutOffset
        }, 400);
        e.preventDefault();

      });
      $(mapLink).click(function(e){
        $('body').stop().animate({
            scrollTop: 0
        }, 400);
        e.preventDefault();
      });
    },
    updateActive: function(){
      window.onscroll = function () {
        win = document.body.scrollTop;
        if (win > aboutOffset - height / 2 && aboutActive === false){
          Scroll.activate(aboutLink, mapLink, true);
          Scroll.updateUrl({page: "about"}, "About", "/#about");
        }
        if (win < aboutOffset - height / 2 && aboutActive === true){
          Scroll.activate(mapLink, aboutLink, false);
          Scroll.updateUrl({page: "home"}, "Home", "/");
        }
      };
      window.onresize = function(e) {
        aboutOffset = about.offsetTop;
        win = document.body.scrollTop;
        height = window.innerHeight;
      };
    },
    updateUrl: function(obj, title, url){
      history.replaceState(obj, title, url);
    },
    activate: function(active, inactive, status, url){
      active.className += " active";
      inactive.className = "nav-right";
      aboutActive = status;
    }
  };

  return Scroll;

});