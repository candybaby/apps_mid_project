app.controller('DirectionMapCtrl', function($scope, $stateParams, Geolocation, $window, ActivityManager, SettingManager, $timeout, acLabActivity) {
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
    $scope.zoom;
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
  		console.log("init watchID:" + $scope.watchID);
        google.maps.event.addListener(map, 'zoom_changed', function() {
            console.log(map.getZoom());
        });
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
});