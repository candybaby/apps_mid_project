app.controller('FriendDetailCtrl',
	function($scope, $stateParams) {
		
		$scope.init = function() {
			// for (var attrName in $stateParams) {
		 //    	alert("stateParams - "+attrName+" : "+$stateParams[attrName]);
			// }
			$scope.name = $stateParams["name"];
			$scope.phone = "電話：" + $stateParams["phone"];
			if ($stateParams["email"] != "") {
				$scope.email = "郵件：" + $stateParams["email"];
			}
			$scope.photo = $stateParams["photo"];
		};
	}
);

