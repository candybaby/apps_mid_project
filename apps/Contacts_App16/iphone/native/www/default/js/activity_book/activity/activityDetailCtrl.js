
/* JavaScript content from js/activity_book/activity/activityDetailCtrl.js in folder common */
app.controller('ActivityDetailCtrl', function($scope, $stateParams, ActivityManager, $state, SettingManager, acLabActivity, ActivityMemberManager, ChatManager, $window, $ionicActionSheet, $ionicLoading) {
	$scope.activity = {};
	$scope.name = SettingManager.getHost().name;
	$scope.account = SettingManager.getHost().account;
	
	$scope.init = function() {
		$scope.id = $stateParams["id"];
		$scope.activity = ActivityManager.getById($scope.id);
		console.log("*** : account" + $scope.account);
		console.log("*** : activityId" + $scope.id);
		console.log("*** : " + ActivityMemberManager.getByActivityIdAndAccount($scope.id, $scope.account).memberName);
		console.log("*** : " + moment($scope.activity.startTime).format());
	};

	$scope.onInviteClick = function() {
		$state.go('tab.friendList', {
            id: $scope.id
        });
	};

	$scope.onJoinClick = function() {
        $scope.show();
		acLabActivity.accept($scope.account, $scope.id, function(res) {
			$scope.activity.status = "Join";
			ActivityManager.update($scope.activity, function() {
                $scope.hide();
            });
		});
	};

	$scope.onNotJoinClick = function() {
        $scope.show();
		acLabActivity.refuse($scope.account, $scope.id, function(res) {
			$scope.activity.status = "notJoin";
			ActivityManager.update($scope.activity, function() {
                var chat = {};
                chat.id = ChatManager.isExist("", $scope.id);
                ChatManager.delete(chat, function() {
                    $scope.hide();
                });
            });
		});
	};

	$scope.onMemberClick = function() {
		$state.go('tab.memberList', {
            activityId: $scope.id
        });
	};

	$scope.onChatClick = function() {
		$state.go('messagepage', {
            activityId: $scope.id
        });
	};

	$scope.onMapClick = function() {
		$state.go('directionMap', {
            id: $scope.id
        });
	};

	$scope.canJoin = function() {
		return $scope.activity.status != "Join" && moment($scope.activity.startTime).diff(moment()) > 0;
	};

	$scope.canRefuse = function() {
		return $scope.activity.status == "Join" && moment($scope.activity.startTime).diff(moment()) > 0;
	};

	$scope.canChat = function() {
		return $scope.activity.status == "Join";
	};

	$scope.canUseMap = function() {
		return $scope.activity.status == "Join" && $scope.activity.place;
	};

	$scope.canInvite = function() {
		return $scope.meIsOwner() && moment($scope.activity.startTime).diff(moment()) > 0;
	};

	$scope.canSetNotify = function() {
		return ($scope.activity.eventId == null || $scope.activity.eventId == undefined || $scope.activity.eventId == '') && $scope.activity.status == "Join";
	};

	$scope.canRenoveNotify = function() {
		return !$scope.canSetNotify() && $scope.activity.status == "Join";
	};

	$scope.meIsOwner = function() {
		return ($scope.activity.owner == $scope.account);
	};

	$scope.isInvited = function() {
		return $scope.activity.status == "Invited";
	};

	$scope.reportEvent = function() {
        $state.go('tab.activity');
    };

    $scope.showActionsheet = function() {
    	$ionicActionSheet.show({
     		buttons: [
       			{ text: '0 分鐘' },
       			{ text: '1 分鐘' },
       			{ text: '5 分鐘' },
       			{ text: '10 分鐘' },
       			{ text: '1 小時' },
       			{ text: '1 天' },
       			{ text: '1 週' },
     		],
     		titleText: '請選擇 多久前提醒',
     		cancelText: 'Cancel',
     		buttonClicked: function(index) {
     			switch (index) {
     				case 0:
     					$scope.reminderTime = 0;
     					break;
     				case 1:
     					$scope.reminderTime = 1;
     					break;
     				case 2:
     					$scope.reminderTime = 5;
     					break;
     				case 3:
     					$scope.reminderTime = 10;
     					break;
     				case 4:
     					$scope.reminderTime = 60;
     					break;
     				case 5:
     					$scope.reminderTime = 1440;
     					break;
     				case 6:
     					$scope.reminderTime = 10080;
     					break;
     			}
     			$scope.onSetEventClick('add');
       			return true;
     		},
     		cancel: function() {
        		console.log('CANCELLED');
      		},
   		});
  	};

    $scope.removeEvent = function() {
        $scope.show();
    	gapi.client.load('calendar', 'v3', function() {
			var list = gapi.client.calendar.calendarList.list({
				minAccessRole: 'writer'
			});
			list.execute(function(resp) {
				var calendarId = resp.items[0].id;
				var remove = gapi.client.calendar.events.delete({
					calendarId: calendarId,
					eventId: $scope.activity.eventId
				});
				remove.execute(function(resp) {
					console.log(JSON.stringify(resp));
					$scope.activity.eventId = '';
                    ActivityManager.update($scope.activity, function() {
                        $scope.hide();
                    });
				});
			});
		});
    };

    $scope.setEvent = function() {
        $scope.show();
        var startDate = moment($scope.activity.startTime).format();
        var endDate = moment($scope.activity.endTime).format();
        gapi.client.load('calendar', 'v3', function() {
            var list = gapi.client.calendar.calendarList.list({
                minAccessRole: 'writer'
            });
            list.execute(function(resp) {
                var calendarId = resp.items[0].id;
                var insert = gapi.client.calendar.events.insert({
                    calendarId: calendarId,
                    resource: {
                        summary: $scope.activity.name,
                        location: $scope.activity.place,
                        description: $scope.activity.describe,
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
                                minutes: $scope.reminderTime,
                            }]
                        }
                    }
                });
                insert.execute(function(resp) {
                    console.log(JSON.stringify(resp));
                    // 記錄eventId 未來刪除或是修改會用到
                    $scope.activity.eventId = resp.id;
                    ActivityManager.update($scope.activity, function() {
                        $scope.hide();
                    });
                });
            });
        });
	};

	$scope.onSetEventClick = function(condition) {
        if (gapi.auth.getToken()) {
            if (condition == 'add') {
            	$scope.setEvent();
            } else {
            	$scope.removeEvent();
            }
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
                            if (condition == 'add') {
                            	$scope.setEvent();
            				} else {
            					$scope.removeEvent();
            				}
                        });
                    });
                }
            });
        }
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

    $scope.backButton = [{
        type: 'button-icon button-clear ion-ios7-arrow-back',
        tap: function() {
            $state.go('tab.activity');
        }
    }];
});

