
/* JavaScript content from js/06_push/messagePageCtrl.js in folder common */
app.controller('MessagePageCtrl', function($scope, $stateParams, FriendManager, MessageManager, SettingManager, iLabMessage, $rootScope) {
		$scope.model = {};
		$scope.message = {};
		$scope.message.text = "";
		var emptyObj = {};
	
		$scope.init = function() {
			$scope.id = $stateParams["id"];
			$scope.model = angular.copy(FriendManager.getById($scope.id));
			$scope.onReceiveMessage();
		};

		$scope.onSendMessageClick = function() {
			var msgObj = {};
			msgObj['targetPhone'] = $scope.model.phone;
			msgObj['content'] = $scope.message.text;
			msgObj['owner'] = 'source';
			MessageManager.add(msgObj);
			iLabMessage.sendMessage(SettingManager.getHost().phone, $scope.model.phone, $scope.message.text);
			$scope.message.text = "";
		};

		$scope.getMessageList = function() {
    		return MessageManager.getByPhone($scope.model.phone);
    	};

		// $scope.onSendMessageClick = function() {
		// 	iLabMessage.sendMessage(SettingManager.getHost().phone, $scope.model.phone, $scope.message.text);
		// 	$scope.message.text = "";
		// 	$scope.state = $scope.BLESS;
		// };
	
		// $scope.onMessageClick = function() {
		// 	$scope.state = $scope.MESSAGE;
		// };
	
		// $scope.onReceiveMessageClick = function() {
		// 	$scope.state = $scope.MESSAGE;
		// 	$scope.message.text = "";
		// };
	
		$scope.onReceiveMessage = function() {
			$rootScope.$on('phonegapPush.notification', function(event, res) {
				var index = res.data.indexOf(":");
				var phone = res.data.substring(0, index);
				var message = res.data.substring(index + 1, res.data.length);
				var msgObj = {};
				msgObj['targetPhone'] = phone;
				msgObj['content'] = message;
				msgObj['owner'] = 'target';
				MessageManager.add(msgObj);
    			$scope.$apply();
    		});
		};
	}
);

