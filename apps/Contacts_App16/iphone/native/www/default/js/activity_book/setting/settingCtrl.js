
/* JavaScript content from js/activity_book/setting/settingCtrl.js in folder common */
app.controller('SettingCtrl',function($scope, $window, SettingManager, $ionicLoading, $location, Notification, acLabMember, $http){
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
        if ($scope.host.hasFB) {
            $scope.registerMember();
        } else {
            acLabMember.authRequest($scope.host.account, function() {
                $scope.hide();
                $scope.state = $scope.AUTH;
            }, function() {
                $scope.hide();
                Notification.alert('帳號已經有人使用', null, "警告");
            });
        }
    };

    $scope.onBackClick = function() {
        $scope.state = $scope.UNREGISTERED;
    };

    $scope.onCancelClick = function() {
        $scope.initHost();
        SettingManager.setHost($scope.host);
        $scope.$apply();
    };

    $scope.onSubmitClick = function() {
    	$scope.show();
    	acLabMember.authCheck($scope.host.account, $scope.authText.content, function(res) {
    		if (res == "true") {
                $scope.host.pictureUrl = "images/default.jpg";
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
        if (!$scope.host.hasFB) {
            $window.openFB.login('user_friends,email', function() {
                $scope.getMeFromFB();
            },
            function(error) {
                $scope.hide();
                Notification.alert("已授權ActivityBook", null, '警告', '確定');
            });
        } else {
        } 
    };

    $scope.getMeFromFB = function() {
        $window.openFB.api({
            path: '/me',
            params: {fields: "name,email,picture"},
            success: function(response) {
                console.log(JSON.stringify(response));
                    
                $scope.host.hasFB = true;
                //$scope.host.pictureUrl = response.picture.data.url;
                $scope.host.pictureUrl = "https://graph.facebook.com/" + response.id + "/picture";
                $scope.host.FBid = response.id;

                if ($scope.state == $scope.REGISTERED) {
                    acLabMember.update($scope.host, function() {
                        SettingManager.setHost($scope.host);
                    }, function(res) {
                        Notification.alert('更新失敗：' + res, null, "警告");
                    });
                } else {
                    $scope.host.account = response.email;
                    $scope.host.name = response.name;
                    SettingManager.setHost($scope.host);
                }
                $scope.$apply();
            },
            error: function(error) {
                console.log("fb get picture fail:" + JSON.stringify(error));
            }
        });
    };

    $scope.onDeleteClick = function() {
        $scope.show();
        acLabMember.unregister($scope.host.account, function(response) {
            $scope.initHost();
            SettingManager.setHost($scope.host);
            $scope.hide();
            $scope.state = $scope.UNREGISTERED;
        }, function() {
            $scope.hide();
            Notification.alert('刪除失敗', null, "警告");
        });
    };

    $scope.initHost = function() {
        $scope.host.name = "";
        $scope.host.phone = "";
        $scope.host.account = "";
        $scope.host.pictureUrl = "";
        $scope.host.hasFB = false;
        $scope.host.FBid = "";
        $scope.host.registered = false;
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

    $scope.setFriendsFromGoogleDrive = function() {
        if (gapi.auth.getToken()) {
            getDriveFile();
        } else {
            liquid.helper.oauth.authorize(function(uriLocation) {
                var oAuth = liquid.helper.oauth;
                if (oAuth.authCode) {
                    oAuth.saveRefreshToken({ 
                        auth_code: oAuth.authCode
                    }, function() {
                        liquid.helper.oauth.getAccessToken(function(tokenObj) {
                            console.log('Access Token >> ' + tokenObj.access_token);
                            gapi.auth.setToken({
                                access_token: tokenObj.access_token
                            });
                            getDriveFile();
                        });
                    });
                }
            });
        }
    };


    function getDriveFile() {
        $scope.show();
        gapi.client.load('drive', 'v2', function() {
            var list = gapi.client.drive.files.list();
            var addressBook = 'friends.csv';
            list.execute(function(resp) {
                for (var i = 0; i < resp.items.length; i++) {
                    if (resp.items[i].title == addressBook) {
                        $http.get(resp.items[i].webContentLink).success(function(data, status, headers, config) {
                            var lines = data.split('\r\n');
                            for (var i = 1, max = lines.length; i < max; i++) {
                                var freindItems = lines[i].split(',');
                                var friend = {
                                        name: freindItems[0],
                                        phone: freindItems[1],
                                        email: freindItems[2],
                                        birthday: freindItems[3]
                                };
                                //FriendManager.add(friend, $scope.$apply);
                                console.log("listFriend" + friend.name);
                            }
                        });
                        $scope.hide();
                        return;
                    }
                }
                $scope.hide();
                Notification.alert("存取" + addressBook + "失敗", null, '警告', '確定');
            });
        });
    };

    $scope.setEvent = function() {
        var startDate = new Date();
        var endDate = new Date();
        startDate.setMinutes(startDate.getMinutes() + 6);
        endDate.setMinutes(endDate.getMinutes() + 6);
        gapi.client.load('calendar', 'v3', function() {
            var list = gapi.client.calendar.calendarList.list({
                minAccessRole: 'writer'
            });
            list.execute(function(resp) {
                var calendarId = resp.items[0].id;
                var insert = gapi.client.calendar.events.insert({
                    calendarId: calendarId,
                    resource: {
                        summary: '測試事件',
                        location: '某個地點',
                        description: '測試描述',
                        start: {
                            dateTime: startDate,
                            timeZone: "Asia/Taipei"
                        },
                        end: {
                            dateTime: endDate,
                            timeZone: "Asia/Taipei"
                        },
                        reminders: {
                            useDefault: false,
                            overrides: [{
                                method: 'popup',
                                minutes: 3
                            }]
                        }
                    }
                });
                insert.execute(function(resp) {
                    console.log(JSON.stringify(resp));
                    // 記錄eventId 未來刪除或是修改會用到
                    alert("create event success"+resp.id);
                });
            });
        });
        // gapi.client.load('calendar', 'v3', function() {
        //         var list = gapi.client.calendar.calendarList.list({
        //             minAccessRole: 'writer'
        //         });
        //         list.execute(function(resp) {
        //             var calendarId = resp.items[0].id;
        //             var remove = gapi.client.calendar.events.delete({
        //                 calendarId: calendarId,
        //                 eventId: friend.eventId
        //             });
        //             remove.execute(function(resp) {
        //                 console.log(JSON.stringify(resp));
        //                 friend.eventId = '';
        //                 FriendManager.edit(friend);
        //             });
        //         });
        //     });
    };

    $scope.onSetEventClick = function() {
        if (gapi.auth.getToken()) {
            $scope.setEvent();
        } else {
            liquid.helper.oauth.authorize(function(uriLocation) {
                var oAuth = liquid.helper.oauth;
                if (oAuth.authCode) {
                    oAuth.saveRefreshToken({ 
                        auth_code: oAuth.authCode
                    }, function() {
                        liquid.helper.oauth.getAccessToken(function(tokenObj) {
                            console.log('Access Token >> ' + tokenObj.access_token);
                            gapi.auth.setToken({
                                access_token: tokenObj.access_token
                            });
                            $scope.setEvent();
                        });
                    });
                }
            });
        }
    };

});