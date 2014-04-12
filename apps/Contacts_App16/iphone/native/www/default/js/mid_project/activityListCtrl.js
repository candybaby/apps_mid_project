
/* JavaScript content from js/mid_project/activityListCtrl.js in folder common */
app.controller('ActivityListCtrl', function($scope, acLabActivity) {
		$scope.activities = [];
		$scope.init = function() {
			acLabActivity.getActivities(function(response) {
                	$scope.activities = response;
                });
		};

		$scope.setActivitiesModel = function(response) {
			//$scope.activities = response;
		}

		$scope.getActivityNumber = function() {
			return $scope.activities.length;
		}
	}
);

