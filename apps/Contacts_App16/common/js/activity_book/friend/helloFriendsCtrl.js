app.controller('HelloFriendsCtrl', function($scope, $state, SettingManager, Notification) {
	$scope.UNREGISTERED = 0;
	$scope.REGISTERED = 1;
	$scope.state = $scope.UNREGISTERED;

	$scope.init = function() {
		$scope.host = SettingManager.getHost();
		if ($scope.host.registered) {
			$scope.state = $scope.REGISTERED;
		}
    };

    $scope.newFriendsButton = [{
		type: 'button-icon button-clear ion-plus',
		tap: function() {
			if ($scope.state == $scope.REGISTERED) {
				$state.go('tab.newfriend');
			} else {
				Notification.alert('請先註冊', null, "提示");
			}
        }
	}];

    $scope.onRegisterClick = function() {
    	$state.go('tab.setting');
    };
});