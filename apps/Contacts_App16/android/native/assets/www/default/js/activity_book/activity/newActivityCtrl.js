
/* JavaScript content from js/activity_book/activity/newActivityCtrl.js in folder common */
app.controller('NewActivityCtrl', function($scope, Notification, SettingManager, acLabActivity, $state, sharedData, ActivityManager, ActivityMemberManager) {
	$scope.activity = {};

	$scope.init = function() {
		var activity = sharedData.getActivity();
		$scope.activity.name = activity.name ? activity.name : "";
		$scope.activity.place = activity.place ? activity.place : "";
		$scope.activity.startTime = activity.startTime ? activity.startTime : "";
		$scope.activity.endTime = activity.endTime ? activity.endTime : "";
		$scope.activity.describe = activity.describe ? activity.describe : "";
		$scope.activity.latlng = activity.latlng ? activity.latlng : "";
		// 離開時清空
	};

	$scope.onCreateClick = function() {
		if (!$scope.activity.name) {
			Notification.alert("請輸入活動名稱", null, '警告', '確定');
			return;
		}
		$scope.activity.owner = SettingManager.getHost().account;
		//create
		acLabActivity.add($scope.activity, function(id) {
			$scope.activity.id = id;
			console.log("activity id: " + id);
			$scope.activity.status = "Join";
			$scope.activity.eventId = '';
			ActivityManager.add($scope.activity, function() {
				$scope.activity = {};
				Notification.alert("建立活動成功", null, '提示', '確定');
				sharedData.setActivity({});

				// 以下為將自己新增至 活動成員中
				var people = {};
				people.activityId = id;
				people.memberAccount = SettingManager.getHost().account;
				people.memberName = SettingManager.getHost().name;
				people.isJoin = 1;
				ActivityMemberManager.add(people);
			});
		});
	};

	$scope.onFocusLocation = function() {
		var activity = sharedData.getActivity();
        activity.name = $scope.activity.name;
        activity.startTime = $scope.activity.startTime;
        activity.endTime = $scope.activity.endTime;
        activity.describe = $scope.activity.describe;
        sharedData.setActivity(activity);
		$state.go('chooselocationpage');
	};

	$scope.onFocusStartTime = function() {
		var activity = sharedData.getActivity();
        activity.name = $scope.activity.name;
        activity.startTime = $scope.activity.startTime;
        activity.endTime = $scope.activity.endTime;
        activity.describe = $scope.activity.describe;
        sharedData.setActivity(activity);
        $state.go('dateTimePicker', {
            option: 'start'
        });
	};

	$scope.onFocusEndTime = function() {
		var activity = sharedData.getActivity();
        activity.name = $scope.activity.name;
        activity.startTime = $scope.activity.startTime;
        activity.endTime = $scope.activity.endTime;
        activity.describe = $scope.activity.describe;
        sharedData.setActivity(activity);
        $state.go('dateTimePicker', {
            option: 'end'
        });
	};
});

