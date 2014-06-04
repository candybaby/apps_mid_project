app.controller('MemberListCtrl', function($scope, $stateParams, ActivityMemberManager, $window) {
	
	$scope.init = function() {
		$scope.id = $stateParams["id"];
        console.log("MemberListCtrl init : " + $scope.id);
	};

    $scope.getMemberList = function() {
        return ActivityMemberManager.getByActivityId($scope.id);
    };

    $scope.reportEvent = function() {
        $window.history.back();
    };

}).filter('joinStatusAdapter', function() {
    return function(isJoin) {
        console.log("joinStatusAdapter:" + isJoin);
        if (isJoin == false || isJoin == 0) {
            return "不參加";
        } else if(isJoin == true || isJoin == 1) {
            return "參加";
        }
        return "尚未決定";
    };
});