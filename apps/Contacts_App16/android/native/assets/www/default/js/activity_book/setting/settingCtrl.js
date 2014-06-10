
/* JavaScript content from js/activity_book/setting/settingCtrl.js in folder common */
app.controller('SettingCtrl',function($scope, $window, SettingManager, $ionicLoading, $location, Notification, acLabMember, $http, DBManager, FriendManager, MessageManager, ChatManager, ActivityManager, ActivityMemberManager) {
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
        acLabMember.register($scope.host, function(result) {
            result = JSON.parse(result);
            $scope.hide();
            $scope.host.registered = true;
            Notification.alert('登入成功', null, "通知");
            SettingManager.setHost($scope.host);
            console.log("result" + result);
            if (result == "update") {
                $scope.getData(function() {
                    $window.plugins.MQTTPlugin.CONNECT(angular.noop, angular.noop, $scope.host.phone, $scope.host.account);
                });
            } else {
                $window.plugins.MQTTPlugin.CONNECT(angular.noop, angular.noop, $scope.host.phone, $scope.host.account);
            }
            
            $scope.state = $scope.REGISTERED;
        }, function(res) {
            $scope.hide();
            Notification.alert('登入失敗：' + res.error, null, "警告");
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
            $window.plugins.MQTTPlugin.CONNECT(angular.noop, angular.noop, "nullclient", "nulltopic");
            DBManager.databaseReset(function() {
                $scope.hide();
                $scope.resetManagers();
                $scope.state = $scope.UNREGISTERED;
            });
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

    $scope.resetManagers = function() {
        FriendManager.reset();
        MessageManager.reset();
        ChatManager.reset();
        ActivityManager.reset();
        ActivityMemberManager.reset();
    };

    $scope.getData = function(doneCallBack) {
        acLabMember.getMemberData($scope.host.account, function(response) {
            var friends = response.friends;
            var messages = response.messages;
            var activities = response.activities;
            var activityMember = response.activity_members;

            $scope.recoverFriendsDB(friends, function() {
                $scope.recoverMessagesDB(messages, function() {
                    $scope.recoverActivityDB(activities, function() {
                        $scope.recoverActivityMemberDB(activityMember, function() {
                            if(typeof(doneCallBack)=='function') {  
                                doneCallBack();
                            }; 
                        });
                    });
                });
            });
        });
    };

    $scope.recoverFriendsDB = function(friends, doneCallBack) {
        for(var i = 0; i < friends.length; i++) {
            console.log("recoverFriendsDB");
            var friend = friends[i];
            FriendManager.addFriend(friend, function(addedFriend) {
                if (addedFriend.account == friends[friends.length-1].account) {
                    if(typeof(doneCallBack)=='function') {  
                        console.log("recoverFriendsDB call back!!!!!!!!"); 
                        doneCallBack();
                    }; 
                }
            });
        }
    };

    $scope.recoverMessagesDB = function(messages, doneCallBack) {
        for(var i = 0; i < messages.length; i++) {
            console.log("recoverMessagesDB");
            var message = messages[i];
            message.mId = messages[i].id;
            if (messages[i].senderAccount == $scope.host.account) {
                // 我傳的
                message.fromAccount = messages[i].receiverAccount;
                message.owner = "source";
            } else {
                message.fromAccount = messages[i].senderAccount;
                message.owner = "target";
            }
            message.content = messages[i].message;
            message.dateTime = messages[i].time;
            MessageManager.add(message, function(addedMessage) {
                if (addedMessage.mId == messages[messages.length-1].id) {
                    if(typeof(doneCallBack)=='function') {  
                        console.log("recoverMessagesDB call back!!!!!!!!"); 
                        doneCallBack();
                    }; 
                }
            });
        }
    };

    $scope.recoverActivityDB = function(activities, doneCallBack) {
        for(var i = 0; i < activities.length; i++) {
            console.log("recoverActivityDB");
            var activity = activities[i];
            activity.status = "";
            ActivityManager.add(activity, function(addedActivity) {
                if (addedActivity.id == activities[activities.length-1].id) {
                    if(typeof(doneCallBack)=='function') {  
                        console.log("recoverActivityDB call back!!!!!!!!"); 
                        doneCallBack();
                    }; 
                }
            });
        }
    };

    $scope.recoverActivityMemberDB = function(activityMember, doneCallBack) {
        // 設定Activity status
        for (var index in activityMember) {
            if (activityMember[index].memberAccount == $scope.host.account) {
                var activity = ActivityManager.getById(activityMember[index].activityId);
                if (activityMember[index].isJoin == "1") {
                    activity.status = "Join";
                } else if(activityMember[index].isJoin == "0") {
                    activity.status = "notJoin";
                } else {
                    activity.status = "Invited";
                }
                ActivityManager.update(activity);
            }
        }

        for(var i = 0; i < activityMember.length; i++) {
            console.log("recoverActivityMemberDB");
            var people = activityMember[i];
            people.memberName = activityMember[i].name;
            ActivityMemberManager.add(people, function(addedActivityMember) {
                if (addedActivityMember.memberAccount == activityMember[activityMember.length-1].memberAccount && addedActivityMember.activityId == activityMember[activityMember.length-1].activityId) {
                    if(typeof(doneCallBack)=='function') {  
                        console.log("recoverActivityDB call back!!!!!!!!"); 
                        doneCallBack();
                    }; 
                }
            });
        }
    };

});