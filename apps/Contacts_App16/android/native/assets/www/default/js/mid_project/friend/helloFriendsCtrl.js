
/* JavaScript content from js/mid_project/friend/helloFriendsCtrl.js in folder common */
app.controller('HelloFriendsCtrl', function($scope, $location, FriendManager, Notification, Contacts) {

	$scope.model = {};

	$scope.showDeleteOption = false;
	
	$scope.init = function() {
		//$scope.friendList = FriendManager.list();
    };

    $scope.getFriendList = function() {
    	return FriendManager.list();
    };

    $scope.getMemberList = function() {
    	return FriendManager.list();
    };

    $scope.onFriendItemClick = function(msg) {
    	if (!$scope.showDeleteOption) {
    		$location.url('tab/frienddetail?id=' + msg);
    	}
    };
	
	$scope.onDeleteFriendClick = function(id) {
		$scope.model = angular.copy(FriendManager.getById(id));
		var message = "姓名：" + $scope.model.name;
		Notification.confirm(message , deleteConfirmCheck, "刪除", "確定,取消");
	};

	var deleteConfirmCheck = function(ans) {
		if (ans == 1) {
			$scope.onDelete();
		}
	};
	
	$scope.onDelete = function() {
		FriendManager.remove($scope.model);
		$scope.model = {};
		$scope.$apply(update());
	};

	$scope.deleteOptionButton = [{
		type: 'button-icon button-clear ion-minus',
		tap: function() {
            $scope.showDeleteOption = !$scope.showDeleteOption;
        }
	}];

	$scope.newFriendsButton = [{
		type: 'button-icon button-clear ion-plus',
		tap: function() {
            $location.url('tab/newfriend');
        }
	}];

	$scope.getFriendsCount = function() {
		return FriendManager.count();
	};

	$scope.getMembersCount = function() {
		return FriendManager.count();
	};

    var update = function() {};
});