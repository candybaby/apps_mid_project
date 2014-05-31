
/* JavaScript content from js/activity_book/chat/messagePageCtrl.js in folder common */
app.controller('MessagePageCtrl', function($scope, $stateParams, $state, $location, $window, $ionicModal, FriendManager, MessageManager, SettingManager, acLabMessage, ChatManager, Geolocation, $timeout, ActivityManager) {
    $scope.model = {};
    $scope.activity = {};
	  $scope.account = $stateParams["account"];
	  $scope.model = angular.copy(FriendManager.getByAccount($scope.account));
	  $scope.activityId = $stateParams["activityId"] ? $stateParams["activityId"] : 0;
    $scope.activity = $stateParams["activityId"] ? ActivityManager.getById($stateParams["activityId"]) : {};
	  $scope.chatName = ($scope.activityId) ? "activityName" : $scope.model.name;
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
        }
   	};

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