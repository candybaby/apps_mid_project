app.controller('ActivityDetailCtrl', function($scope, $stateParams, acLabActivity) {
		$scope.activity = {};
	
		$scope.init = function() {
			$scope.id = $stateParams["id"];
			acLabActivity.getActivitiesById($scope.id, function(response) {
                	$scope.activity = response;
            });
		};
	}
);

