
/* JavaScript content from js/mid_project/friend/helloFriendsCtrl.js in folder common */
app.controller('HelloFriendsCtrl', function($scope, $location, FriendManager, Notification, Contacts, InviteFriendManager) {

	$scope.model = {};

	$scope.showDeleteOption = false;
	$scope.showInviteFriendsList = true;
	$scope.showMembersList = true;
	$scope.showFriendsList = true;
	
	$scope.init = function() {
		// but 空的method
		// $scope.checkAllIsMember();
    };

    $scope.checkAllIsMember = function() {
		FriendManager.updateIsMember();
		//console.log("checkAllIsMember");
    };

    $scope.getInviteFriendList = function() {
    	return InviteFriendManager.list();
    };

    $scope.getFriendList = function() {
    	return FriendManager.listFriend();
    };

    $scope.getMemberList = function() {
    	return FriendManager.listMember();
    };

    $scope.onFriendItemClick = function(msg) {
    	if (!$scope.showDeleteOption) {
    		$location.url('tab/frienddetail?id=' + msg);
    	}
    };

	$scope.onInviteFriendAcceptClick = function(id) {
    	var inviteFriend = InviteFriendManager.getById(id);
    	InviteFriendManager.remove(inviteFriend);
    	var friend = {};
    	friend.name = inviteFriend.name ? inviteFriend.name : inviteFriend.phone;
		friend.phone = inviteFriend.phone;
		FriendManager.add(friend);
    };

    $scope.onInviteFriendDeclineClick = function(id) {
    	var inviteFriend = InviteFriendManager.getById(id);
    	InviteFriendManager.remove(inviteFriend);
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
            FriendManager.updateIsMember();
        }
	}];

	$scope.newFriendsButton = [{
		type: 'button-icon button-clear ion-plus',
		tap: function() {
            $location.url('tab/newfriend');
        }
	}];

	$scope.getInviteFriendsCount = function() {
		return InviteFriendManager.count();
	};

	$scope.getFriendsCount = function() {
		return FriendManager.countFriend();
	};

	$scope.getMembersCount = function() {
		return FriendManager.countMember();
	};

	$scope.getMemberBadgeText = function(count) {
		//var count = FriendManager.badgeCount(id);
		if (count > 10) {
			return "10+";
		} else {
			return count;
		}
	};

    var update = function() {};
});