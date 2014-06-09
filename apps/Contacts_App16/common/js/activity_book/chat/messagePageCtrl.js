app.controller('MessagePageCtrl', function($scope, $stateParams, $state, $location, $window, $ionicModal, FriendManager, MessageManager, SettingManager, acLabMessage, ChatManager, Geolocation, $timeout, ActivityManager, Notification) {
    $scope.model = {};
    $scope.activity = {};
	  $scope.account = $stateParams["account"] ? $stateParams["account"] : "";
	  $scope.model = angular.copy(FriendManager.getByAccount($scope.account)); // 找不到回傳false
	  $scope.activityId = $stateParams["activityId"] ? $stateParams["activityId"] : 0;
    $scope.activity = ActivityManager.getById($scope.activityId);
	  $scope.chatName = $scope.activityId != 0 ? $scope.activity.name + "活動聊天室" : $scope.model.name;
	  $scope.$on('receivedMessage', function(res, message) {
		    // var cId = ChatManager.isExist($scope.account, $scope.activityId);
		    // ChatManager.resetBadge(cId);
		    $scope.$apply();
	  });
	  $ionicModal.fromTemplateUrl('imgList.html', function(modal) {
    	  $scope.modal = modal;
  	}, {
    	  animation: 'slide-in-up',
    	  scope: $scope
  	});

	  $scope.init = function() {
        console.log("message init activityId:" + $scope.activityId);
		    var cId = ChatManager.isExist($scope.account, $scope.activityId);
		    ChatManager.resetBadge(cId);
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
		    acLabMessage.sendMessage(SettingManager.getHost().account, $scope.model.account, msg, $scope.activityId, null, function(res) {
            Notification.alert(res.error, null, "提示");
        });
	  };

//
   	$scope.onMessageShow = function(id) {
    	var message = MessageManager.getById(id);

    	if (!message.hasRead && message.owner == "target") {
    	 	if ($scope.activityId == 0) {
                acLabMessage.readMessage(message.mId);
    	 	}
            var cId = ChatManager.isExist($scope.account, $scope.activityId);
			ChatManager.resetBadge(cId);
    	}
    };

	  $scope.getMessageList = function() {
    	  return MessageManager.getBy($scope.activityId, $scope.model.account);
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
        }
   	};

    $scope.backButton = [{
		    type: 'button-icon button-clear ion-ios7-arrow-back',
		    tap: function() {
            var cId = ChatManager.isExist($scope.account, $scope.activityId);
            ChatManager.resetBadge(cId);
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
.filter('nameAdapter', function(FriendManager, ActivityMemberManager) {
    return function(accountString, activityId) {
        if (activityId != 0) {
            return ActivityMemberManager.getByActivityIdAndAccount(activityId, accountString)['memberName']
        } else {
            return FriendManager.getByAccount(accountString)['name'];
        }
    };
})
.controller('ImgListCtrl', function($scope) {

});