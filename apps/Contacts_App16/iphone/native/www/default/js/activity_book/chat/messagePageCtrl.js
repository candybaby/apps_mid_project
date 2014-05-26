
/* JavaScript content from js/activity_book/chat/messagePageCtrl.js in folder common */
app.controller('MessagePageCtrl', function($scope, $stateParams, $state, $location, $window, $ionicModal, FriendManager, MessageManager, SettingManager, acLabMessage, ChatManager, Geolocation, $timeout) {
	$scope.model = {};
	$scope.account = $stateParams["account"];
	$scope.model = angular.copy(FriendManager.getByAccount($scope.account));
	$scope.activityId = 0;
	$scope.chatName = ($scope.activityId)? "groupName112233445566778899001122663344" : $scope.model.name;
	$scope.$on('receivedMessage', function(res, message) {
		var cId = ChatManager.isExist($scope.account, $scope.activityId);
		ChatManager.resetBadge(cId);
		$scope.$apply();
	});
	$ionicModal.fromTemplateUrl('imgList.html', function(modal) {
    	$scope.modal = modal;
  	}, {
    	animation: 'slide-in-up',
    	scope: $scope
  	});

	$scope.init = function() {
		console.log("history" + $window.history.length);
		var cId = ChatManager.isExist($scope.account, $scope.activityId);
		ChatManager.resetBadge(cId);
		//FriendManager.clearBadgeCount($scope.model.phone);
		$scope.refreshTime();
	};

	$scope.refreshTime = function() {
    	$timeout($scope.refreshTime, 30000, true);
	};

	$scope.onSendMessageClick = function() {
		var message = prompt("請輸入訊息...","");
		if (message) {
			$scope.sendMessage(message);
		}
	};

	$scope.onSendLocationClick = function() {
		console.log("onSendLocationClick");
		Geolocation.getCurrentPosition(function(position) {
			console.log("onSendLocationClick: getLocation");
			var location = "map:("+position.coords.latitude+","+position.coords.longitude+")";
    		$scope.sendMessage(location);
    	}, function () {
    		console.log("error");
    	});
	};

	$scope.sendMessage = function(msg) {
		//alert("sendMessage:" + msg);
		acLabMessage.sendMessage(SettingManager.getHost().account, $scope.model.account, msg, 0);
	}

   	$scope.onMessageShow = function(id) {
    	var message = MessageManager.getById(id);

    	if (!message.hasRead && message.owner == "target") {
    	 	acLabMessage.readMessage(message.mId);
    	 	var cId = ChatManager.isExist($scope.account, $scope.activityId);
			ChatManager.resetBadge(cId);
    	}
    };

	$scope.getMessageList = function() {
    	return MessageManager.getByAccount($scope.model.account);
   	};

   	$scope.readMessage = function(mId) {
    	acLabMessage.readMessage(mId);
   	};

   	$scope.onMessageClick = function(message) {
   		console.log("onMessageClick");
        if (!message.content.replace(/\map:\([0-9.]+,[0-9.]+\)/, '')) {
        	var latlng = message.content.match(/([0-9.-]+).+?([0-9.-]+)/);
   			$state.go('map', {
        		latitude:latlng[1],
        		longitude:latlng[2],
        		friendName:$scope.model.name,
        		isMe:message.owner == 'source'
        	});
			// $scope.latitude = latlng[1];
   //        	$scope.longitude = latlng[2];
   //     		$scope.friendName = $scope.model.name;
   //        	$scope.isMe = message.owner == 'source';
			// $scope.modal.show();
			// if (typeof($scope.modalMapInitCallBack()) == "function") {
			// 	$scope.modalMapInitCallBack();
			// }
        }
   	};

   	// $scope.modalMapSetInitCallBack = function(init) {
   	// 	$scope.modalMapInitCallBack = init;
   	// };

   	// $scope.onCloseModalMap = function() {
   	// 	$scope.modal.hide();
   	// };

    $scope.backButton = [{
		type: 'button-icon button-clear ion-ios7-arrow-back',
		tap: function() {
            $window.history.back();
        }
	}];

	$scope.showModal = function() {
		console.log("showModal");
		$scope.modal.show();
	};

	$scope.onCloseClick = function() {
		$scope.modal.hide();
	};
})
.directive('myMessageRepeatDirective', function($ionicScrollDelegate) {
  	return function(scope, element, attrs) {
    	if (scope.$last){
      		// iteration is complete, do whatever post-processing
      		// is necessary
      		$ionicScrollDelegate.scrollBottom(true);
    	}
  	};
})
.filter('isSpcMsg', function() {
    return function(messageString) {
        var result = messageString.replace(/\map:\([0-9.]+,[0-9.]+\)/, '');
        if (!result) {
            return true;
        }
        return false;
    };
})
.controller('ImgListCtrl', function($scope) {

});
// .controller('ModalMapCtrl', function($scope, Geolocation) {
//   	console.log('ModalCtrl');
// 	$scope.position = {};
// 	$scope.distance = {};
// 	$scope.distance.text = "";
// 	$scope.duration = {};
// 	$scope.duration.text = "";
// 	$scope.zoom = 13;

// 	$scope.modalMapInit = function() {
// 		$scope.modalMapSetInitCallBack($scope.modalMapInit);
// 		console.log('modalMapInit' + $scope.isMe);
// 		if($scope.isMe) {
// 			var origin = new google.maps.LatLng($scope.latitude, $scope.longitude);
// 			var mapOptions = {
// 				    zoom: $scope.zoom,
// 				    center: origin,
// 				    disableDefaultUI: true
// 				  };
// 			var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
// 			var marker = new MarkerWithLabel({
// 			    position: origin,
// 			    labelContent: "我",
// 			    labelAnchor: new google.maps.Point(30, 0),
// 			    labelClass: "labels",
// 			    labelStyle: {opacity: 0.75}
// 			});
// 			$scope.friendName = "我的位置";	
// 			marker.setMap(map);
// 		} else {
// 			Geolocation.getCurrentPosition(function(position) {
// 				var directionsService = new google.maps.DirectionsService();
// 				var origin = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
// 				var destination = new google.maps.LatLng($scope.latitude, $scope.longitude);
// 				var mapOptions = {
// 					    zoom: $scope.zoom,
// 					    center: origin,
// 					    disableDefaultUI: true
// 					  };
// 				map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
// 				var markerOptions = {
// 					visible:false
// 				};
// 				var directionsRendererOptions = {
// 					markerOptions: markerOptions,
// 					map: map,
// 				};
// 				var directionsDisplay = new google.maps.DirectionsRenderer(directionsRendererOptions);
// 				var request = {
// 					    origin:origin,
// 					    destination:destination,
// 					    travelMode: google.maps.TravelMode.WALKING
// 					};
// 				directionsService.route(request, function(result, status) {
// 				    if (status == google.maps.DirectionsStatus.OK) {
// 				    	var leg = result.routes[0].legs[0];
// 				    	directionsDisplay.setDirections(result);
// 				    	$scope.distance.text = leg.distance.text;
// 				    	$scope.duration.text = leg.duration.text;
// 				    	$scope.$apply();
// 						var destinationMarker = new MarkerWithLabel({
// 							position: new google.maps.LatLng(leg.end_location.k, leg.end_location.A),
// 						    labelContent: $scope.friendName,
// 						    labelAnchor: new google.maps.Point(30, 0),
// 						    labelClass: "labels"
// 						});
// 				    	var originMarker = new MarkerWithLabel({
// 						    position: new google.maps.LatLng(leg.start_location.k, leg.start_location.A),
// 						    labelContent: "我",
// 						    labelAnchor: new google.maps.Point(30, 0),
// 						    labelClass: "labels"
// 						});
// 				    	originMarker.setMap(map);
// 				    	destinationMarker.setMap(map);
// 						directionsDisplay.setMap(map);
// 				    }
// 				});
// 			});
// 		}
// 	};
// })
;

