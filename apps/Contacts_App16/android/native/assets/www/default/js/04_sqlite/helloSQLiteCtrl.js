
/* JavaScript content from js/04_sqlite/helloSQLiteCtrl.js in folder common */
app.controller('HelloSQLiteCtrl', function($scope, $location, DBManager, Notification, Contacts) {

	$scope.friendArray;
	$scope.model = {};
	$scope.selectedIndex;

	$scope.showDeleteOption = false;
	
	$scope.init = function() {
		$scope.friendArray = [];
		DBManager.getFriends($scope.getFriendsSuccess);
    };

    $scope.onFriendItemClick = function(msg) {
    	if (!$scope.showDeleteOption) {
    		$location.url('tab/frienddetail?id=' + msg);
    	}
    };
    
	$scope.getFriendsSuccess = function (tx, res) {
		for (var i = 0, max = res.rows.length; i < max; i++) {
			$scope.friendArray.push(res.rows.item(i));
		}
	};
	
	$scope.onDeleteFriendClick = function(index) {
		$scope.model = angular.copy($scope.friendArray[index]);
		$scope.selectedIndex = index;
		var message = "姓名：" + $scope.model.name;
		Notification.confirm(message , deleteConfirmCheck, "刪除", "確定,取消");
	};

	var deleteConfirmCheck = function(ans) {
		if (ans == 1) {
			$scope.onDelete();
		}
	};
	
	$scope.onDelete = function() {
		DBManager.deleteFriend($scope.model.id, function() {
			$scope.friendArray.splice($scope.selectedIndex, 1);
		});
		$scope.$apply(update);
	};

	$scope.deleteOptionButton = [{
		type: 'button-icon button-clear ion-minus',
		tap: function() {
            $scope.showDeleteOption = !$scope.showDeleteOption;
        }
	}];

    var update = function() {};
});