app.controller('NewFriendCtrl', function($scope, $location,$state, $window, $ionicLoading, Notification, acLabFriend, SettingManager, FriendManager) {
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

    // 搜尋click
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

	// 新增click
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

	$scope.searchFBFriendsButton = [{
		type: 'button-icon button-clear ion-social-facebook-outline',
		tap: function() {
			$scope.onFBRegisterClick();
        }
	}];

	// 搜尋FBclick
	$scope.onSearchFBClick = function() {
		$scope.show();
		$scope.candidates = {};
		$window.openFB.api({
            path: '/me',
            params: {fields: "friends"},
            success: function(response) {
                console.log(JSON.stringify(response));
                var friendList = response.friends.data;
                var FBids = [];
    			for(var i = 0, max = friendList.length; i < max; i++) {
    				console.log(friendList[i].name);
    				FBids.push(friendList[i].id)
    			}
    			console.log(JSON.stringify(FBids));
    			acLabFriend.searchByFB(FBids, $scope.host.account, $scope.searchFBSuccess, $scope.searchFBError);
                $scope.hide();
            },
            error: function(error) {
                console.log("fb get friends fail:" + JSON.stringify(error));
                $scope.hide();
            }
        });
		
	};
	$scope.searchFBSuccess = function(res) {
		console.log("search:" + res);
		$scope.candidates = res;
		if(Object.keys($scope.candidates).length == 0) {
			Notification.alert('無結果，請輸入其他尋條件！', null, "提示");
		}
	};
	$scope.searchFBError = function() {
		Notification.alert('搜尋失敗', null, "提示");
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

 	$scope.onFBRegisterClick = function() {
        $window.openFB.login('user_friends,email', function() {
            $scope.onSearchFBClick();
        },
        function(error) {
            $scope.hide();
            Notification.alert("已授權ActivityBook", null, '警告', '確定');
        });
    };

    $scope.backButton = [{
        type: 'button-icon button-clear ion-ios7-arrow-back',
        tap: function() {
            $state.go('tab.friends');
        }
    }];

});

