
/* JavaScript content from js/05_sms/friendDetailCtrl.js in folder common */
app.controller('FriendDetailCtrl', function($scope, $stateParams, FriendManager, Notification, $window) {
		$scope.model = {};
		$scope.editModel = {};
		$scope.showEditOption = false;
		var emptyObj = {};

		$scope.init = function() {
			$scope.id = $stateParams["id"];
			$scope.model = angular.copy(FriendManager.get($scope.id));
		};

		$scope.getHasEmail = function() {
			return ($scope.model.email != "" && $scope.model.email != null);
		};

		$scope.getHasBirthday = function() {
			return ($scope.model.birthday != "" && $scope.model.birthday != null);
		};

		$scope.onEditClick = function() {
			updateFriend();
			$scope.editModel = {};
			$scope.showEditOption = false;
		};

		$scope.editFriendButton = [{
			type: 'button-icon button-clear ion-ios7-compose',
			tap: function() {
				$scope.showEditOption = !$scope.showEditOption;
				if ($scope.showEditOption) {
					$scope.editModel = angular.copy($scope.model);
				} else {
					if (!angular.equals($scope.editModel, $scope.model)) {
						var message = "朋友資訊有變更是否儲存";
						Notification.confirm(message , updateFriendCheck, "提示", "儲存,取消");
					} else {
						$scope.editModel = {};
					}
				}
       		}
		}];

		var updateFriend = function() {
			var friend = angular.copy($scope.editModel);
			FriendManager.update(friend);
			$scope.model = angular.copy($scope.editModel);
		};

		var updateFriendCheck = function(ans) {
			if (ans == 1) {
				updateFriend();
			} else {
				$scope.editModel = {};
			}
		};

		$scope.onSMSClick = function() {
			var message = $scope.model.name + "：真高興，你又長了一歲。祝你生日快樂，永遠快樂！";
			$window.sms.send($scope.model.phone, message, "INTENT");
			//$window.open("sms:"+ $scope.model.phone + "?body=" + message);
		};
	
		$scope.onPhoneClick = function() {
			$window.open("tel:"+ $scope.model.phone);
		};
	
		$scope.onEmailClick = function() {
			var subject = "生日快樂！";
			var message = $scope.model.name + "：真高興，你又長了一歲。祝你生日快樂，永遠快樂！";
			$window.plugins.emailComposer.showEmailComposer(subject, message, [$scope.model.email], [], [], true, []);
			//$window.open('mailto:' + $scope.model.email + '?subject=' + subject + '&body=' + message);
		};

		var isObjectEmpty = function(obj) {
			for(var prop in obj) {
        		if(obj.hasOwnProperty(prop)) {
        			return false;	
        		}
    		}
    		return true;
		};
	}
);

