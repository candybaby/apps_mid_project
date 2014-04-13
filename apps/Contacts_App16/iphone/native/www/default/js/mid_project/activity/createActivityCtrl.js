
/* JavaScript content from js/mid_project/activity/createActivityCtrl.js in folder common */
app.controller('CreateActivityCtrl', function($scope, Notification, SettingManager, acLabActivity) {
		$scope.activity = {};
		$scope.init = function() {
		};

		$scope.onCreateClick = function() {
			if (!$scope.activity.name) {
				Notification.alert("請輸入活動名稱", null, '警告', '確定');
				return;
			}
			$scope.activity.owner = SettingManager.getHost().phone;
			//create
			acLabActivity.createActivity($scope.activity);
			$scope.activity = {};

			Notification.alert("建立活動成功", null, '提示', '確定');
		};
	}
);

