app.controller('ChatCtrl', function($scope, $state, $location, SettingManager, ChatManager) {
	$scope.UNREGISTERED = 0;
	$scope.REGISTERED = 1;

	$scope.state = $scope.UNREGISTERED;
	$scope.init = function() {
		$scope.host = SettingManager.getHost();
		if ($scope.host.registered) {
			$scope.state = $scope.REGISTERED;
		}
    };

    $scope.onRegisterClick = function() {
    	$state.go('tab.setting');
    };

    $scope.getChatList = function() {
    	return ChatManager.list();
    };

    $scope.onTestClick = function() {
    	ChatManager.addBadge(1);
    };

    $scope.onFriendChatClick = function(account) {
    	//alert("onFriendChatClick" + account);
    	$location.url('messagepage?account=' + account);//friend id
    };
});