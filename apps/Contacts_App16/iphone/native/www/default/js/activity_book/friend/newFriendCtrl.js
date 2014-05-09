
/* JavaScript content from js/activity_book/friend/newFriendCtrl.js in folder common */
app.controller('NewFriendCtrl', function($scope, $location,$state, Notification, acLabFriend, SettingManager, FriendManager) {
	$scope.candidates = {};
	$scope.search = {};

	$scope.init = function() {
		$scope.host = SettingManager.getHost();
		if ($scope.host.registered) {
		} else {
			$location.path('/tab/friends').replace();
		} 
    };

    $scope.clearText = function() {
    	$scope.search.text = "";
    };

	$scope.onSearchClick = function() {
		$scope.candidates = {};
		acLabFriend.search($scope.search.text, $scope.host.account, $scope.searchSuccess, $scope.searchError);
	};
	$scope.searchSuccess = function(res) {
		console.log("search:" + res);
		$scope.candidates = res;
		if(Object.keys($scope.candidates).length == 0) {
			Notification.alert('無結果，請輸入其他尋條件！', null, "提示");
		}
	};
	$scope.searchError = function() {
		Notification.alert('搜尋失敗', null, "提示");
	};

	$scope.onAddClick = function(account) {
		acLabFriend.add($scope.host.account, account, function() {
			var friend = angular.copy($scope.candidates[account]);
			delete $scope.candidates[account];
			FriendManager.addWaitingAcceptFriend(friend);
			Notification.alert('邀請已送出', null, "提示");
		}, $scope.addError);
	};
	$scope.addError = function() {
		Notification.alert('邀請失敗', null, "提示");
	};

});

