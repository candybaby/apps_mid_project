app.controller('ActivityListCtrl', function($scope, $location, acLabActivity, SettingManager) {
		$scope.ownActivities = [];
		$scope.invitedActivities = [];
		$scope.init = function() {
			var phone = SettingManager.getHost().phone;
			acLabActivity.getActivitiesByOwner(phone, function(response) {
                	$scope.ownActivities = response;
            });
			acLabActivity.getActivitiesByPhone(phone, function(response) {
                	$scope.invitedActivities = response;
            });
		};

		$scope.getOwnActivityNumber = function() {
			return $scope.ownActivities.length;
		};

		$scope.getInvitedActivityNumber = function() {
			return $scope.invitedActivities.length;
		};

		$scope.onActivityItemClick = function(msg) {
    		$location.url('tab/activitydetail?id=' + msg);
    	};

		$scope.newActivityButton = [{
			type: 'button-icon button-clear ion-plus',
			tap: function() {
            	$location.url('tab/createactivity');
        	}
		}];
	}
);

