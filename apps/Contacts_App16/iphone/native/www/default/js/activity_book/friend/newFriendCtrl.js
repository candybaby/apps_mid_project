
/* JavaScript content from js/activity_book/friend/newFriendCtrl.js in folder common */
app.controller('NewFriendCtrl', function($scope, $location,$state, Notification, acLabFriend, SettingManager) {
	$scope.candidates = {};
	$scope.search = {};

	$scope.init = function() {
		$scope.host = SettingManager.getHost();
		if ($scope.host.registered) {
		} else {
			$location.path('/tab/friends').replace();
		} 
    };

	$scope.onSearchClick = function() {
		$scope.candidates = {};
		acLabFriend.search($scope.search.text, $scope.searchSuccess, $scope.searchError);
	};
	$scope.searchSuccess = function(res) {
		console.log("search:" + res);
		$scope.candidates = res;
	};
	$scope.searchError = function() {
		Notification.alert('搜尋失敗', null, "提示");
	};

	$scope.onAddClick = function(account) {
		acLabFriend.add($scope.host.account, account, function() {
			delete $scope.candidates[account];
			Notification.alert('邀請已送出', null, "提示");
		}, $scope.addError);
		Notification.alert(account, null, "提示");
	};
	$scope.addError = function() {
		Notification.alert('邀請失敗', null, "提示");
	};

});

