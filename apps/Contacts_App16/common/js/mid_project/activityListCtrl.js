app.controller('ActivityListCtrl', function($scope, acLabActivity) {
		$scope.activities = [];
		$scope.init = function() {
			acLabActivity.getActivities(function(response) {
                	$scope.activities = response;
                });
		};

		$scope.getActivityNumber = function() {
			return $scope.activities.length;
		}
	}
);

