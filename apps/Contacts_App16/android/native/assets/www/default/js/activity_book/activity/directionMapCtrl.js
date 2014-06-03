
/* JavaScript content from js/activity_book/activity/directionMapCtrl.js in folder common */
app.controller('DirectionMapCtrl', function($scope, $stateParams, Geolocation, $window, ActivityManager, SettingManager, $timeout, acLabActivity){
    var directionsDisplay;
	  var directionsService = new google.maps.DirectionsService();
	  var map;
    var me = null;
	  $scope.watchID = null;
	  $scope.activity = ActivityManager.getById($stateParams.id);
    var meMarker = null;
    var endMarker = null;
    $scope.data = {};
    var markerIndex = {};
    $scope.$on('receivePosition', function(res, message) {
        if (message.activityId == $stateParams.id) {
            $scope.addMarker(message.lat, message.lng, message.name , message.imgUrl, message.account);
        }
        $scope.$apply();
    });
    $scope.$on('closeMap', function(res, message) {
        if (message.activityId == $stateParams.id) {
            $scope.removeMarker(message.account);
        }
        $scope.$apply();
    });
	
	  $scope.init = function() {
        me = SettingManager.getHost();

        var directionsRendererOptions = {
          suppressMarkers: true,
          map: map,
        };
		    directionsDisplay = new google.maps.DirectionsRenderer(directionsRendererOptions);
  		  
        var taipeiTech = new google.maps.LatLng(25.0441228, 121.5339948);
  		  var mapOptions = {
    		    zoom: 13,
    		    center: taipeiTech,
            streetViewControl: false
  		  }
  		  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  		  
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('directionsPanel'));

        $scope.data.counter = 0;
        $scope.data.position = [];
  		  $scope.watchID = $window.navigator.geolocation.watchPosition(function(position) {
            console.log("watch position : " + position.coords.latitude + " ," + position.coords.longitude);
  		      $scope.calcRoute(position.coords.latitude, position.coords.longitude);
  		  }, null, { frequency : 3000, enableHighAccuracy: true });
        //$timeout($scope.getPosition, 10000, true);
  		  console.log("init watchID:" + $scope.watchID);
    };

    $scope.getPosition = function() {
        Geolocation.getCurrentPosition(function(position) {
            console.log("timer position : " + position.coords.latitude + " ," + position.coords.longitude);
            $scope.calcRoute(position.coords.latitude, position.coords.longitude);
        });
        $timeout($scope.getPosition, 10000, true);
    };

	$scope.calcRoute = function(lat, lng) {
        $scope.data.counter++;
        $scope.data.position.push("( " + lat + " , " + lng + " )");
        $scope.$apply();
        var positionInfo = {};
        positionInfo.activityId = $stateParams.id;
        positionInfo.account = me.account;
        positionInfo.name = me.name;
        positionInfo.imgUrl = me.pictureUrl;
        positionInfo.lat = lat;
        positionInfo.lng = lng;
        acLabActivity.sendPosition(positionInfo);
  	    var start = new google.maps.LatLng(lat, lng);
  		  var end = $scope.activity.latlng;
  		  console.log("start: " + start + " end: " + end);
  		  var waypts = [];
 		    // var checkboxArray = document.getElementById('waypoints'); //*
  		  // for (var i = 0; i < checkboxArray.length; i++) {
    	  //		if (checkboxArray.options[i].selected == true) {
      	//			waypts.push({
        //	  			location:checkboxArray[i].value,
        //	  			stopover:true
        //  		});
    	  //		}
  		  // }

  		  var request = {
      		  origin: start,
      		  destination: end,
      		  waypoints: waypts,
      		  optimizeWaypoints: true,
      		  travelMode: google.maps.TravelMode.WALKING
  		  };
  		
  		  directionsService.route(request, function(response, status) {
    		    if (status == google.maps.DirectionsStatus.OK) {
      			    directionsDisplay.setDirections(response);
                var leg = response.routes[0].legs[0];
                var image = me.pictureUrl;
                var mePosition = new google.maps.LatLng(leg.start_location.k, leg.start_location.A);
                if (meMarker != null) {
                    meMarker.setPosition(mePosition);
                } else {
                    meMarker = new MarkerWithLabel({
                        position: mePosition,
                        labelContent: me.name,
                        labelAnchor: new google.maps.Point(30, 0),
                        labelClass: "labels",
                        icon: image,
                        map: map,
                    });
                }

                var endPosition = new google.maps.LatLng(leg.end_location.k, leg.end_location.A);
                if (endMarker != null) {
                    endMarker.setPosition(endPosition);
                } else {
                    endMarker = new MarkerWithLabel({
                        position: endPosition,
                        labelContent: $scope.activity.place,
                        labelAnchor: new google.maps.Point(30, 0),
                        labelClass: "labels",
                        icon: "images/endMarker.png",
                        map: map,
                    });
                }
    		    }
  		  });
    };

    $scope.addMarker = function(lat, lng, name, imgUrl, account) {
        var position = new google.maps.LatLng(lat, lng);
        if (markerIndex[account] != undefined) {
            markerIndex[account].setMap(map);
            markerIndex[account].setPosition(position);
        } else {
            var marker = new MarkerWithLabel({
                position: position,
                labelContent: name,
                labelAnchor: new google.maps.Point(30, 0),
                labelClass: "labels",
                icon: imgUrl,
                map: map,
            });
            markerIndex[account] = marker;
        }
    }

    $scope.removeMarker = function(account) {
        markerIndex[account].setMap(null);
    }

	  $scope.closeButton = [{
		    type: 'button-icon button-clear ion-ios7-close-empty',
		    tap: function() {
			      console.log("close watchID:" + $scope.watchID);
			      if ($scope.watchID != null) {
				        Geolocation.clearWatch($scope.watchID);
				        $scope.watchID = null;
				        console.log("clearWatch");
			      }
            acLabActivity.closeMap($stateParams.id, me.account, function() {
                $window.history.back();
            });
        }
    }];
    // $scope.testButton = [{
    //     type: 'button-icon button-clear ion-ios7-close-empty',
    //     tap: function() {
    //         var a = Math.floor((Math.random()*6)+1);
    //         console.log("a:" + a);
    //         $scope.addMarker(24.976 + a/10.0, 121.4942, "test1" + a, "images/endMarker.png", "test" + a);
    //     }
    // }];
});