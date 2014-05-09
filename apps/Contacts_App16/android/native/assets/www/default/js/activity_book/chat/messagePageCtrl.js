
/* JavaScript content from js/activity_book/chat/messagePageCtrl.js in folder common */
app.controller('MessagePageCtrl', function($scope, $stateParams, $location, $window, FriendManager, MessageManager, SettingManager, acLabMessage, ChatManager, Geolocation, $timeout) {
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

	$scope.init = function() {
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
			var location = {};
			location.latitude = position.coords.latitude;
			location.longitude = position.coords.longitude;
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

    $scope.backButton = [{
		type: 'button-icon button-clear ion-ios7-arrow-back',
		tap: function() {
            $window.history.back();
        }
	}];
})
.directive('myMessageRepeatDirective', function($ionicScrollDelegate) {
  	return function(scope, element, attrs) {
    	if (scope.$last){
      		// iteration is complete, do whatever post-processing
      		// is necessary
      		$ionicScrollDelegate.scrollBottom(true);
    	}
  	};
});

