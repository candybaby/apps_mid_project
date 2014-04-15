
/* JavaScript content from js/mid_project/app.js in folder common */
var app = angular.module("Contacts_App16", ['ionic', 'PhoneGap', 'acLabActivityBook']);

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	    .state('tab', {
	        url: "/tab",
	        abstract: true,
	        templateUrl: "templates/mid_project/tab.html"
	    })
        .state('tab.friends', {
            url: '/friends',
            views: {
                'tab-friends': {
                    templateUrl: 'templates/mid_project/friend/helloFriends.html',
                    controller: 'HelloFriendsCtrl'
                }
            }
        })
        .state('tab.frienddetail', {
            url: "/frienddetail?id",
            views: {
                'tab-friends': {
                    templateUrl: 'templates/mid_project/friend/friendDetail.html',
                    controller: 'FriendDetailCtrl'
                }
            }
        })
        .state('tab.newfriend', {
            url: "/newfriend",
            views: {
                'tab-friends': {
                    templateUrl: 'templates/mid_project/friend/newFriend.html',
                    controller: 'NewFriendCtrl'
                }
            }
        })
        // .state('tab.messagepage', {
        //     url: "/messagepage?id",
        //     views: {
        //         'tab-friends': {
        //             templateUrl: 'templates/mid_project/friend/messagePage.html',
        //             controller: 'MessagePageCtrl'
        //         }
        //     }
        // })
        .state('messagepage', {
            url: "/messagepage?id",
            templateUrl: 'templates/mid_project/friend/messagePage.html',
            controller: 'MessagePageCtrl'      
        })
        .state('tab.setting', {
            url: "/setting",
            views: {
                'tab-setting': {
                    templateUrl: 'templates/mid_project/setting.html',
                    controller: 'SettingCtrl'
                }
            }
        })
        .state('tab.activitylist', {
            url: "/activitylist",
            views: {
                'tab-activity': {
                    templateUrl: 'templates/mid_project/activity/activityList.html',
                    controller: 'ActivityListCtrl'
                }
            }
        })
        .state('tab.createactivity', {
            url: "/createactivity",
            views: {
                'tab-activity': {
                    templateUrl: 'templates/mid_project/activity/createActivity.html',
                    controller: 'CreateActivityCtrl'
                }
            }
        })
        .state('tab.activitydetail', {
            url: "/activitydetail?id",
            views: {
                'tab-activity': {
                    templateUrl: 'templates/mid_project/activity/activityDetail.html',
                    controller: 'ActivityDetailCtrl'
                }
            }
        })
        ;

    $urlRouterProvider.otherwise("/tab/friends");
});

app.run(function(DBManager, SettingManager, PushNotificationsFactory, $window, PhoneGap, $rootScope, MessageManager) {
    var host = SettingManager.getHost();
    
    PhoneGap.ready(function() {
        if(host.phone) {
            $window.document.addEventListener("pause", function() {
                console.log("**** pause time ****");
                //iLabMessage.resetCounter(host.phone);
            }, false);
        }
        onReceiveMessage();
    });
    
    $window.receiveMessage = function(message) {
        if(message.length <= 0)
            return;
        $rootScope.$broadcast('mqtt.notification', message);
    };
    
    if (host.registered) {
        PhoneGap.ready(function() {     
            $window.plugins.MQTTPlugin.CONNECT(angular.noop, angular.noop, host.phone, host.phone);
            console.log("MQTTPlugin.CONNECT:" + host.phone);
        });
    };
    
    var onReceiveMessage = function() {
        $rootScope.$on('mqtt.notification', function(event, res) {
            // mqtt 傳幾則 收幾則 收到格式 json
            var message = JSON.parse(res);
            var msgObj = {};
            msgObj['targetPhone'] = message['sender_phone'];
            msgObj['content'] = message['message'];
            msgObj['owner'] = 'target';
            MessageManager.add(msgObj);
            console.log("mqtt onReceiveMessage:" + res);
        });
    }
    
    var GCMSENDERID = '568888441927';
    
    PushNotificationsFactory(GCMSENDERID, function(token, type) {
        var host = SettingManager.getHost();
        host.token = token;
        if (type == "GCM")
            host.type = 0;
        else if (type == "APNS")
            host.type = 1;
        SettingManager.setHost(host);
    });
});