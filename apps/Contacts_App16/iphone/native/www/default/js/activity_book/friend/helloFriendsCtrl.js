
/* JavaScript content from js/activity_book/friend/helloFriendsCtrl.js in folder common */
app.controller('HelloFriendsCtrl', function($scope, $state, SettingManager) {
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
});