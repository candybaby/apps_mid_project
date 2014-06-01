app.controller('ChatCtrl', function($scope, $state, $timeout, SettingManager, ChatManager, FriendManager) {
	$scope.UNREGISTERED = 0;
	$scope.REGISTERED = 1;

	$scope.state = $scope.UNREGISTERED;
	$scope.init = function() {
		$scope.host = SettingManager.getHost();
		if ($scope.host.registered) {
			$scope.state = $scope.REGISTERED;
            $scope.refreshTime();
		}
    };

    $scope.refreshTime = function() {
        $timeout($scope.refreshTime, 30000, true);
    };

    $scope.getTimeValue = function(chat) {
        return chat.dateTime;
    };

    $scope.onRegisterClick = function() {
    	$state.go('tab.setting');
    };

    $scope.getChatList = function() {
    	return ChatManager.list();
    };

    $scope.onFriendChatClick = function(account, activityId) {
    	//alert("onFriendChatClick" + account);
        if (activityId == 0) {
            $state.go('messagepage', {
                account: account
            });
        }else {
            $state.go('messagepage', {
                account: account,
                activityId: activityId
            });
        }
    };

    $scope.reportEvent = function(event)  {
        console.log('Reporting : ' + event.type);
        var chat = {};
        chat.id = event.currentTarget.id;
        ChatManager.delete(chat, function() {
            $scope.$apply();
        });
        //alert("chatId:"+event.currentTarget.id);
    };
})
.directive('detectGestures', function($ionicGesture) {
    return {
        restrict :  'A',

        link : function(scope, elem, attrs) {
            var gestureType = attrs.gestureType;

            switch(gestureType) {
                case 'swipe':
                    $ionicGesture.on('swipe', scope.reportEvent, elem);
                    break;
                case 'swiperight':
                    $ionicGesture.on('swiperight', scope.reportEvent, elem);
                    break;
                case 'swipeleft':
                    $ionicGesture.on('swipeleft', scope.reportEvent, elem);
                    break;
                case 'doubletap':
                    $ionicGesture.on('doubletap', scope.reportEvent, elem);
                    break;
                case 'tap':
                    $ionicGesture.on('tap', scope.reportEvent, elem);
                    break;
                case 'scroll':
                    $ionicGesture.on('scroll', scope.reportEvent, elem);
                    break;
            }

        }
    }
})
;