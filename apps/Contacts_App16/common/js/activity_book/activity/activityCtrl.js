app.controller('ActivityCtrl', function($scope, $state, SettingManager, ActivityManager, Notification, $rootScope) {
	$scope.UNREGISTERED = 0;
	$scope.REGISTERED = 1;

	$scope.state = $scope.UNREGISTERED;

	$scope.showActivityInvitedList = true;
	$scope.showActivityNotStartList = true;
	$scope.showActivityStartedList = true;
	$scope.showActivityEndList = true;

	$scope.showActivityInvitedTitle = false;
	$scope.showActivityNotStartTitle = false;
	$scope.showActivityStartedTitle = false;
	$scope.showActivityEndTitle = false;

	$scope.init = function() {
		$scope.host = SettingManager.getHost();
		if ($scope.host.registered) {
			$scope.state = $scope.REGISTERED;
		}
		$rootScope.$broadcast('resetActivityBadge');
    };

    $scope.onActivityInvitedTitleClick = function() {
    	$scope.showActivityInvitedList = !$scope.showActivityInvitedList;
    };

    $scope.onActivityNotStartTitleClick = function() {
    	$scope.showActivityNotStartList = !$scope.showActivityNotStartList;
    };

    $scope.onActivityStartedTitleClick = function() {
    	$scope.showActivityStartedList = !$scope.showActivityStartedList;
    };

    $scope.onActivityEndTitleClick = function() {
    	$scope.showActivityEndList = !$scope.showActivityEndList;
    };

    $scope.setShowActivityInvitedTitle = function() {
    	$scope.showActivityInvitedTitle = true;
    };

    $scope.setShowActivityNotStartTitle = function() {
    	$scope.showActivityNotStartTitle = true;
    };

    $scope.setShowActivityStartedTitle = function() {
    	$scope.showActivityStartedTitle = true;
    };

    $scope.setShowActivityEndTitle = function() {
    	$scope.showActivityEndTitle = true;
    };

    $scope.onRegisterClick = function() {
    	$state.go('tab.setting');
    };

    $scope.newActivityButton = [{
		type: 'button-icon button-clear ion-plus',
		tap: function() {
			if ($scope.state == $scope.REGISTERED) {
				$rootScope.$broadcast('resetActivityBadge');
				$state.go('newactivity');
			} else {
				Notification.alert('請先註冊', null, "提示");
			}
        }
	}];

	$scope.getActivityNotStartList = function() {
		return ActivityManager.listNotStart();
	};

	$scope.getActivityStartedList = function() {
		return ActivityManager.listStarted();
	};

	$scope.getActivityEndList = function() {
		return ActivityManager.listEnd();
	};

	$scope.getActivityInvitedList = function() {
		return ActivityManager.listInvited();
	};

	$scope.onActivityClick = function(activityId) {
		$rootScope.$broadcast('resetActivityBadge');
		$state.go('tab.activitydetail', {
            id:activityId
        });
	};

	$scope.isSetCalendar = function(eventId) {
		if (eventId != '' && eventId != null && eventId != undefined) {
			return true;
		} else {
			return false;
		}
	};

	$scope.isJoin = function(status) {
		if (status == 'Join') {
			return true;
		}
		else
		{
			return false;
		}

	};

	$scope.isNotJoin = function(status) {
		if (status == 'notJoin') {
			return true;
		}
		else
		{
			return false;
		}
	};
});