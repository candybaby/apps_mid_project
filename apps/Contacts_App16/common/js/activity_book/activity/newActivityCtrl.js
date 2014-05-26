app.controller('NewActivityCtrl', function($scope, Notification, SettingManager, acLabActivity, $state, sharedData) {
	$scope.activity = {};

	$scope.init = function() {
		$scope.activity.name = "name";
		$scope.activity.place = sharedData.getData().place;
		$scope.activity.startTime = "2014-5-21 08:12:12";
		$scope.activity.endTime = "2014-5-22 08:12:12";
		$scope.activity.describe = "describe";
		$scope.activity.latlng = sharedData.getData().latlng;
	};

	$scope.onCreateClick = function() {
		if (!$scope.activity.name) {
			Notification.alert("請輸入活動名稱", null, '警告', '確定');
			return;
		}
		$scope.activity.owner = SettingManager.getHost().account;
		//create
		acLabActivity.add($scope.activity, function() {
			$scope.activity = {};
			Notification.alert("建立活動成功", null, '提示', '確定');
			sharedData.setData({});
		});
	};

	$scope.onFocusLocation = function() {
		$state.go('chooselocationpage');
	};
});

