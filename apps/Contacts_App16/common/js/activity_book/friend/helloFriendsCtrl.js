app.controller('HelloFriendsCtrl', function($scope, $state, $ionicLoading, $location, SettingManager, Notification, FriendManager, acLabFriend, $rootScope) {
	$scope.UNREGISTERED = 0;
	$scope.REGISTERED = 1;
	$scope.state = $scope.UNREGISTERED;

	$scope.showFriendTitle = false;
	$scope.showWaitingTitle = false;
	$scope.showInvitedTitle = false;

	$scope.init = function() {
		$scope.host = SettingManager.getHost();
		if ($scope.host.registered) {
			$scope.state = $scope.REGISTERED;
		}
		$rootScope.$broadcast('resetFriendsBadge');
    };

    $scope.getFriendList = function() {
    	return FriendManager.listFriends();
    };

    $scope.getIsWaitingFriendList = function() {
    	return FriendManager.listWaitingFriends();
    };

    $scope.getIsInvitedFriendList = function() {
    	return FriendManager.listInvitedFriends();
    };

    $scope.setShowFriend = function() {
    	$scope.showFriendTitle = true;
    };

    $scope.setShowWaiting = function() {
    	$scope.showWaitingTitle = true;
    };

    $scope.setShowInvited = function() {
    	$scope.showInvitedTitle = true;
    };

    $scope.newFriendsButton = [{
		type: 'button-icon button-clear ion-plus',
		tap: function() {
			if ($scope.state == $scope.REGISTERED) {
				$rootScope.$broadcast('resetFriendsBadge');
				$state.go('tab.newfriend');
			} else {
				Notification.alert('請先註冊', null, "提示");
			}
        }
	}];

	$scope.onFriendClick = function(account) {
		$rootScope.$broadcast('resetFriendsBadge');
		$state.go('messagepage', {
            account:account
        });
	};

	$scope.onAcceptClick = function(account) {
		$rootScope.$broadcast('resetFriendsBadge');
        var friend = FriendManager.getByAccount(account);
        // send accept
        $scope.show();
		acLabFriend.accept($scope.host.account, account, function() {
			$scope.hide();
			friend.isInvited = 0;
        	FriendManager.update(friend);
		}, function() {
			$scope.hide();
			Notification.alert('發生錯誤，請重試！', null, "提示");
		});
	};

	$scope.onRefuseClick = function(account) {
		$rootScope.$broadcast('resetFriendsBadge');
		var friend = FriendManager.getByAccount(account);
		// send refuse
		$scope.show();
		acLabFriend.refuse($scope.host.account, account, function() {
			$scope.hide();
			FriendManager.remove(friend);
		}, function() {
			$scope.hide();
			Notification.alert('發生錯誤，請重試！', null, "提示");
		});
	};

    $scope.onRegisterClick = function() {
    	$state.go('tab.setting');
    };

    $scope.show = function() {
        $scope.loading = $ionicLoading.show({
          content: "<i class='ion-loading-b'></i>",
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 500
        });
    };
    
    $scope.hide = function() {
    	$scope.loading.hide();
    };
});