
/* JavaScript content from js/activity_book/activity/activityCtrl.js in folder common */
app.controller('ActivityCtrl', function($scope, $state, SettingManager) {
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

    $scope.newActivityButton = [{
		type: 'button-icon button-clear ion-plus',
		tap: function() {
			if ($scope.state == $scope.REGISTERED) {
				$state.go('tab.newactivity');
			} else {
				Notification.alert('請先註冊', null, "提示");
			}
        }
	}];
});