import $ from '../lib/$'

function setupList () {
  if (isHome){
    $list.find('.roaster').each(function(){
      var $this = $(this);
      var letter = $this.data('name').charAt(0);
      $this.find('.letter').html(letter);
    });
  }
}

function toggleList (){
  var $nameLink     = $('#by-name');
  var $distance     = $('#distance');
  var $alpha        = $('#roasters');
  var $distanceLink = $('#by-distance');


  $distanceLink.click(function(e) {
    e.preventDefault();

    if (!Map.location ){
      Map.locate();
    }

    $distanceLink.addClass('active');
    $nameLink.removeClass('active');
    $alpha.addClass('hidden');
    $distance.removeClass('hidden');
  });

  $nameLink.click(function(e) {
    e.preventDefault();
    $nameLink.addClass('active');
    $distanceLink.removeClass('active');
    $distance.addClass('hidden');
    $alpha.removeClass('hidden');
  });
}

function parseList () {

  function rank(a,b){
    if (a.distance > b.distance){ return 1; }
    if (a.distance < b.distance){ return -1; }
    return 0;
  }

  if (Map.roasters && Map.location){
    var roasters = [];

    for (var i = 0; i < Map.roasters.length; i++){
      var roaster = Map.roasters[i];
      if (roaster.lat && roaster.lng){
        var latlng = new L.LatLng(roaster.lat, roaster.lng);
        var distance = latlng.distanceTo(Map.location.latlng) * 0.000621371;
        roaster.distance = parseFloat(distance.toFixed(2));
        roasters.push(roaster);
      }
    }

    roasters.sort((a,b) => return b - a)
    var $distance = $('#distance');
    var text = '';

    for (var j = 0; j < roasters.length; j++){
      text += '<li class="roaster"><div class="distance"><span class="letter">' + roasters[j].distance + '<br>miles</span></div><a href="/roaster/' + roasters[j].slug + '/" class="handle"><span class="list-name">' + roasters[j].name + '</span><span class="address">' + roasters[j].address + '</span></a></li>';
    }

    $distance.html(text);
  }

}

function roasters () {
  $('')
}


export default {
  roasters
}
