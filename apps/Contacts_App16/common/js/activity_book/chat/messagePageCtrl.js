app.controller('MessagePageCtrl', function($scope, $stateParams, $ionicScrollDelegate, $location, $window, FriendManager, MessageManager, SettingManager, acLabMessage, ChatManager) {
	$scope.model = {};
	$scope.account = $stateParams["account"];
	$scope.model = angular.copy(FriendManager.getByAccount($scope.account));
	$scope.groupId = 0;
	$scope.chatName = ($scope.groupId)? "groupName112233445566778899001122663344" : $scope.model.name;
	$scope.$on('receivedMessage', function(res, message) {
		$scope.$apply();
	});

	$scope.init = function() {
		var cId = ChatManager.isExist($scope.account, $scope.groupId);
		ChatManager.resetBadge(cId);
		//FriendManager.clearBadgeCount($scope.model.phone);
	};

	$scope.onSendMessageClick = function() {
		var message = prompt("請輸入訊息...","");
		if (message) {
			$scope.sendMessage(message);
		}
	};

	$scope.sendMessage = function(msg) {
		//alert("sendMessage:" + msg);
		acLabMessage.sendMessage(SettingManager.getHost().account, $scope.model.account, msg, 0);
	}

   	$scope.onMessageShow = function(id) {
    	var message = MessageManager.getById(id);

    	if (!message.hasRead && message.owner == "target") {
    	 	acLabMessage.readMessage(message.mId);
    	}
    	var cId = ChatManager.isExist($scope.account, $scope.groupId);
		ChatManager.resetBadge(cId);
    	$ionicScrollDelegate.scrollBottom(true);
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
});

