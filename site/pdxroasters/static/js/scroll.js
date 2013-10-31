define(["jquery"], function ($) {

  if ($('body').hasClass('home')){
    var list       = document.getElementById('list'),
        listLink   = document.getElementById('list_link'),
        mapLink     = document.getElementById('map_link'),
        listOffset = list.offsetTop,
        win         = document.body.scrollTop,
        height      = window.innerHeight,
        listActive = false;
  }

  var Scroll = {
    init: function() {
      if (list){
        if(window.location.href.indexOf("#list") == -1){
          Scroll.activate(mapLink, listLink, false);
        }
        if(window.location.href.indexOf("#list") != -1){
          Scroll.activate(listLink, mapLink, true);
        }
      }
    },
    smoothScroll: function(){
      $(listLink).click(function(e){
        $('body').stop().animate({
            scrollTop: listOffset
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
        if (win > listOffset - height / 2 && listActive === false){
          Scroll.activate(listLink, mapLink, true);
          Scroll.updateUrl({page: "list"}, "About", "/#list");
        }
        if (win < listOffset - height / 2 && listActive === true){
          Scroll.activate(mapLink, listLink, false);
          Scroll.updateUrl({page: "home"}, "Home", "/");
        }
      };
      window.onresize = function(e) {
        listOffset = list.offsetTop;
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
      listActive = status;
    }
  };

  return Scroll;

});