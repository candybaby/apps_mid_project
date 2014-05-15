app.controller('SettingCtrl',function($scope, $window, SettingManager, $ionicLoading, $location, Notification, acLabMember){
	$scope.UNREGISTERED = 0;
	$scope.AUTH = 1;
	$scope.REGISTERED = 2;

	$scope.state = $scope.UNREGISTERED;
	$scope.authText = {};

    $scope.pictureUrl = "";
	
	$scope.init = function() {
		$scope.host = SettingManager.getHost();
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

    $scope.onBackClick = function() {
        $scope.state = $scope.UNREGISTERED;
    };

    $scope.onSubmitClick = function() {
    	$scope.show();
    	acLabMember.authCheck($scope.host.account, $scope.authText.content, function(res) {
    		if (res == "true") {
    			$scope.registerMember();

    		} else {
    			// 認證失敗
    			$scope.hide();
    			Notification.alert('認證失敗', null, "警告");
    		}
    	});
    };

    $scope.registerMember = function() {
        acLabMember.register($scope.host, function() {
            $scope.hide();
            $scope.host.registered = true;
            Notification.alert('註冊成功', null, "通知");
            SettingManager.setHost($scope.host);
            $window.plugins.MQTTPlugin.CONNECT(angular.noop, angular.noop, $scope.host.phone, $scope.host.account);
            $scope.state = $scope.REGISTERED;
        }, function(res) {
            $scope.hide();
            Notification.alert('註冊失敗：' + res, null, "警告");
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

    $scope.onFBRegisterClick = function() {
        $window.openFB.login('user_friends,email', function() {
            $window.openFB.api({
                path: '/me',
                params: {fields: "name,email,picture"},
                success: function(response) {
                    //console.log("picture" + response.picture.data.url);
                    console.log(JSON.stringify(response));
                    //Notification.alert("已授權ActivityBook", null, '消息', '確定');
                    
                    $scope.host.hasFB = true;
                    $scope.host.pictureUrl = response.picture.data.url;
                    
                    if ($scope.state == $scope.REGISTERED) {
                        acLabMember.update($scope.host, function() {
                            SettingManager.setHost($scope.host);
                        }, function(res) {
                            Notification.alert('更新失敗：' + res, null, "警告");
                        });
                    } else {
                        $scope.host.account = response.email;
                        $scope.host.name = response.name;
                    }
                    SettingManager.setHost($scope.host);
                },
                error: function(error) {
                    console.log("fb get picture fail:" + JSON.stringify(error));
                }
            });
        },
        function(error) {
            $scope.hide();
            Notification.alert("已授權ActivityBook", null, '警告', '確定');
        });
    };

    $scope.onDeleteClick = function() {
        $scope.show();
        acLabMember.unregister($scope.host.account, function(response) {
            $scope.host.name = "";
            $scope.host.phone = "";
            $scope.host.account = "";
            $scope.host.topic = "";
            $scope.host.registered = false;
            SettingManager.setHost($scope.host);
            $scope.hide();
            $scope.state = $scope.UNREGISTERED;
        }, function() {
            $scope.hide();
            Notification.alert('刪除失敗', null, "警告");
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