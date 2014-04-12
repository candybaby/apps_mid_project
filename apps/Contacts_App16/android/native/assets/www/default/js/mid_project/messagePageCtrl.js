
/* JavaScript content from js/mid_project/messagePageCtrl.js in folder common */
app.controller('MessagePageCtrl', function($scope, $stateParams, FriendManager, MessageManager, SettingManager, iLabMessage) {
		$scope.model = {};
		$scope.message = {};
		$scope.message.text = "";
		var emptyObj = {};
	
		$scope.init = function() {
			$scope.id = $stateParams["id"];
			$scope.model = angular.copy(FriendManager.getById($scope.id));
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
	}
);

