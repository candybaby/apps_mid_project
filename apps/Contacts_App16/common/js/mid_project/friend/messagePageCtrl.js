app.controller('MessagePageCtrl', function($scope, $stateParams, $ionicScrollDelegate, $rootScope, $location, FriendManager, MessageManager, SettingManager, acLabMessage) {
		$scope.model = {};
		
		$scope.init = function() {
			$scope.id = $stateParams["id"];
			$scope.model = angular.copy(FriendManager.getById($scope.id));
			FriendManager.clearBadgeCount($scope.model.phone);
			//$scope.onReceiveMessage();
		};

		$scope.onSendMessageClick = function() {
			var message = prompt("請輸入訊息...","");
			if (message) {
				$scope.sendMessage(message);
			}
		};

		$scope.sendMessage = function(msg) {
			// 已讀
			acLabMessage.sendMessage(SettingManager.getHost().phone, $scope.model.phone, msg, 0);
		}

		// $scope.onReceiveMessage = function() {
  //       	$rootScope.$on('receiveMessage', function(event, res) {
  //       		if (res['message_type'] == "chat" && 
  //       			(res['sender_phone'] == $scope.model.phone || 
  //       				(res['send_myself'] && res['receiver_phone'] ==$scope.model.phone)))
  //       		{
  //       			$ionicScrollDelegate.scrollBottom(true);
  //       		}
  //       	});
  //   	};

    	$scope.onMessageShow = function(id) {
    		var message = MessageManager.getById(id);

    		if (!message.hasRead && message.owner == "target") {
    		 	acLabMessage.readMessage(message.mId);
    		}
    		
    		$ionicScrollDelegate.scrollBottom(true);
    	};

		$scope.getMessageList = function() {
    		return MessageManager.getByPhone($scope.model.phone);
    	};

    	$scope.readMessage = function(mId) {
    		acLabMessage.readMessage(mId);
    	};

    	$scope.backButton = [{
		type: 'button-icon button-clear ion-ios7-arrow-back',
		tap: function() {
            $location.url('tab/frienddetail?id=' + $scope.model.id);
        }
	}];
	}
);

