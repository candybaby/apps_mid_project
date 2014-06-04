
/* JavaScript content from js/activity_book/activity/activityDetailCtrl.js in folder common */
app.controller('ActivityDetailCtrl', function($scope, $stateParams, ActivityManager, $state, SettingManager, acLabActivity, ActivityMemberManager, ChatManager, $window) {
	$scope.activity = {};
	$scope.name = SettingManager.getHost().name;
	$scope.account = SettingManager.getHost().account;
	
	$scope.init = function() {
		$scope.id = $stateParams["id"];
		$scope.activity = ActivityManager.getById($scope.id);
		console.log("*** : account" + $scope.account);
		console.log("*** : activityId" + $scope.id);
		console.log("*** : " + ActivityMemberManager.getByActivityIdAndAccount($scope.id, $scope.account).memberName);
	};

	$scope.onInviteClick = function() {
		$state.go('tab.friendList', {
            id: $scope.id
        });
	};

	$scope.onJoinClick = function() {
		acLabActivity.accept($scope.account, $scope.id, function(res) {
			$scope.activity.status = "Join";
			ActivityManager.update($scope.activity);
		});
	};

	$scope.onNotJoinClick = function() {
		acLabActivity.refuse($scope.account, $scope.id, function(res) {
			$scope.activity.status = "notJoin";
			ActivityManager.update($scope.activity);
			var chat = {};
        	chat.id = ChatManager.isExist("", $scope.id);
        	ChatManager.delete(chat);
		});
	};

	$scope.onMemberClick = function() {
		$state.go('tab.memberList', {
            activityId: $scope.id
        });
	};

	$scope.onChatClick = function() {
		$state.go('messagepage', {
            activityId: $scope.id
        });
	};

	$scope.onMapClick = function() {
		$state.go('directionMap', {
            id: $scope.id
        });
	};

	$scope.canJoin = function() {
		return $scope.activity.status != "Join";
	};

	$scope.canRefuse = function() {
		return $scope.activity.status == "Join";
	};

	$scope.canChat = function() {
		return $scope.activity.status == "Join";
	};

	$scope.canUseMap = function() {
		return $scope.activity.status == "Join" && $scope.activity.place;
	};

	$scope.canInvite = function() {
		return $scope.meIsOwner();
	};

	$scope.canSetNotify = function() {
		return false;
	};

	$scope.meIsOwner = function() {
		return ($scope.activity.owner == $scope.account);
	};

	$scope.isInvited = function() {
		return $scope.activity.status == "Invited";
	};

	$scope.reportEvent = function() {
        $window.history.back();
    };
});

