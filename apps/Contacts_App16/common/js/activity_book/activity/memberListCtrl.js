app.controller('MemberListCtrl', function($scope, $stateParams, ActivityMemberManager) {
	
	$scope.init = function() {
		$scope.id = $stateParams["id"];
	};

    $scope.getMemberList = function() {
        return ActivityMemberManager.getByActivityId($scope.id);
    };
    
}).filter('joinStatusAdapter', function() {
    return function(isJoin) {
        if (isJoin == 0) {
            return "不參加";
        } else if(isJoin == 1) {
            return "參加";
        }
        return "尚未決定";
    };
});