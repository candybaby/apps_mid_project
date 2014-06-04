app.controller('ChatCtrl', function($scope, $state, $timeout, SettingManager, ChatManager, FriendManager) {
	$scope.UNREGISTERED = 0;
	$scope.REGISTERED = 1;
    // $scope.data = {
    //     showDelete: false
    // };

	$scope.state = $scope.UNREGISTERED;
	$scope.init = function() {
		$scope.host = SettingManager.getHost();
		if ($scope.host.registered) {
			$scope.state = $scope.REGISTERED;
            $scope.refreshTime();
		}
    };

    $scope.refreshTime = function() {
        $timeout($scope.refreshTime, 30000, true);
    };

    $scope.getTimeValue = function(chat) {
        return chat.dateTime;
    };

    $scope.onRegisterClick = function() {
    	$state.go('tab.setting');
    };

    $scope.getChatList = function() {
    	return ChatManager.list();
    };

    $scope.onFriendChatClick = function(account, activityId) {
    	//alert("onFriendChatClick" + account);
        $state.go('messagepage', {
            account: account,
            activityId: activityId
        });
    };

    $scope.reportEvent = function(event) {
        console.log('Reporting : ' + event.type);
        //$scope.data.showDelete = !$scope.data.showDelete;
        var chat = {};
        chat.id = event.currentTarget.id;
        ChatManager.delete(chat, function() {
            $scope.$apply();
        });
        //alert("chatId:"+event.currentTarget.id);
    };

    $scope.deleteChatEvent = function(id) {
        var chat = {};
        chat.id = id;
        ChatManager.delete(chat, function() {
            $scope.$apply();
        });
    }
});