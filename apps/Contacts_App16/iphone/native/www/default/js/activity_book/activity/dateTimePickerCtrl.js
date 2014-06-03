
/* JavaScript content from js/activity_book/activity/dateTimePickerCtrl.js in folder common */
app.controller('DateTimePickerCtrl', function($scope, $window, sharedData, $filter, $stateParams) {
    $scope.pickerName = $stateParams.option == 'start'? "請選擇開始時間" : "請選擇結束時間";
    $scope.time = {};
	$scope.init = function() {
  		
    };


	$scope.okButton = [{
		type: 'button-icon button-clear ion-ios7-checkmark-outline',
	    tap: function() {
	    	var timeString = $filter('date')($scope.time.date, 'yyyy-MM-dd HH:mm:ss');
            var activity = sharedData.getActivity();
            if ($stateParams.option == 'start') {
            	activity.startTime = timeString;
            } else {
            	activity.endTime = timeString;
           	}
            sharedData.setActivity(activity);
			$window.history.back();
        }
	}];

});