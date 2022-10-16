var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var request = require('request');
var feed;
var latlng;
var i = 0;
var marker;
var markers = [];

//mapを描画するための条件を詳述
var mapOptions = {
  center: new google.maps.LatLng(34.666608, 133.918170), //地図上で表示させる緯度経度
  zoom: 12, //地図の倍率は1が世界地図となり，21段階が最高拡大，12だと都市域が表示される
  mapTypeId: google.maps.MapTypeId.ROADMAP //地図の種類
};
var map = new google.maps.Map(document.getElementById("map_canvas"),
  mapOptions);

var view = function() {
  // 前のマーカーを削除
  if (markers == void(0)) {} else {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = []; //参照を開放
  }

  //realGTFS取得
  var requestSettings = {
    method: 'GET',
    url: 'http://www3.unobus.co.jp/GTFS/GTFS_RT-VP.bin', //宇野バス

    encoding: null
  };
  request(requestSettings, function(error, response, body) {

    if (!error && response.statusCode == 200) {
      feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
      feed.entity.forEach(function(entity) {
        if (entity.vehicle) {
          console.log(entity.vehicle.vehicle.id);
          console.log(entity.vehicle.vehicle.license_plate);
          console.log(entity.vehicle.position);
          latlng = {
            lat: entity.vehicle.position.latitude,
            lng: entity.vehicle.position.longitude
          };

          marker = new google.maps.Marker({
            position: latlng,
            title: entity.vehicle.vehicle.id
          });
          markers.push(marker);
        }
      });
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }
    }
  });
};
view();
setInterval(view, 15000);

