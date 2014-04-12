app.controller('FriendDetailCtrl',
	function($scope, $stateParams, DBManager) {
		$scope.friendArray;
		$scope.model = {};
		$scope.showEditOption = false;
		$scope.init = function() {
			$scope.friendArray = [];
			$scope.id = $stateParams["id"];
			DBManager.getFriendById($scope.id, $scope.getFriendByIdSuccess);
		};

		$scope.getFriendByIdSuccess = function (tx, res) {
			for (var i = 0, max = res.rows.length; i < max; i++) {
				$scope.friendArray.push(res.rows.item(i));
			}
			$scope.model = $scope.friendArray[0];
		};

		$scope.onEditClick = function() {
			var friend = angular.copy($scope.model);
			DBManager.updateFriend(friend, function() {
				$scope.friendArray[0] = friend;
			});
			$scope.showEditOption = false;
		};

		$scope.editFriendButton = [{
			type: 'button-icon button-clear ion-ios7-compose',
			tap: function() {
				$scope.showEditOption = !$scope.showEditOption;
       		}
		}];
	}
);

