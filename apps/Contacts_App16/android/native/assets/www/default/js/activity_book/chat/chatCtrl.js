
/* JavaScript content from js/activity_book/chat/chatCtrl.js in folder common */
app.controller('ChatCtrl', function($scope, $state, $location, $timeout, SettingManager, ChatManager) {
	$scope.UNREGISTERED = 0;
	$scope.REGISTERED = 1;

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

    $scope.onRegisterClick = function() {
    	$state.go('tab.setting');
    };

    $scope.getChatList = function() {
    	return ChatManager.list();
    };

    $scope.onFriendChatClick = function(account) {
    	//alert("onFriendChatClick" + account);
    	$location.url('messagepage?account=' + account);//friend id
    };
});