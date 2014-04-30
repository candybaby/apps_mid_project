
/* JavaScript content from js/activity_book/setting/settingCtrl.js in folder common */
app.controller('SettingCtrl',function($scope, $window, SettingManager, $ionicLoading, $location, Notification, acLabMember){
	$scope.UNREGISTERED = 0;
	$scope.AUTH = 1;
	$scope.REGISTERED = 2;

	$scope.state = $scope.UNREGISTERED;
	$scope.authText = {};
	
	$scope.init = function() {
		$scope.host = SettingManager.getHost();
        console.log("init - ");
        for (var attrName in $scope.host) {
             console.log("init - "+attrName+" : "+$scope.host[attrName]);
        }
		if ($scope.host.registered) {
			$scope.state = $scope.REGISTERED;
            //$window.navigator.app.exitApp();
		}
	};
    
    $scope.onNextClick = function() {
    	$scope.show();
    	acLabMember.authRequest($scope.host.account, function() {
    		$scope.hide();
    		$scope.state = $scope.AUTH;
    	}, function() {
    		$scope.hide();
    		Notification.alert('帳號已經有人使用', null, "警告");
    	});
    };

    $scope.onSubmitClick = function() {
    	$scope.show();
    	acLabMember.authCheck($scope.host.account, $scope.authText.content, function(res) {
    		if (res == "true") {
    			acLabMember.register($scope.host, function() {
    				$scope.hide();
    				$scope.host.registered = true;
    				Notification.alert('註冊成功', null, "通知");
    				SettingManager.setHost($scope.host);
    				$window.plugins.MQTTPlugin.CONNECT(angular.noop, angular.noop, $scope.host.account, $scope.host.account);
    				$scope.state = $scope.REGISTERED;
    			}, function(res) {
     				$scope.hide();
     				Notification.alert('註冊失敗：' + res, null, "警告");
 				});

    		} else {
    			// 認證失敗
    			$scope.hide();
    			Notification.alert('認證失敗', null, "警告");
    		}
    	});
    };
	
	$scope.onReSendAuthClick = function() {
		$scope.show();
    	acLabMember.authRequest($scope.host.account, function() {
    		$scope.hide();
    	}, function() {
    		$scope.hide();
    		Notification.alert('帳號已經有人使用', null, "警告");
    	});
	};

    $scope.show = function() {
        $scope.loading = $ionicLoading.show({
          content: "<i class='ion-loading-b'></i>",
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 500
        });
    };
    
    $scope.hide = function() {
    	$scope.loading.hide();
    };
});