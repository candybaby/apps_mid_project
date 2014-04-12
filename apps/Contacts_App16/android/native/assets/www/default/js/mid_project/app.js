
/* JavaScript content from js/mid_project/app.js in folder common */
var app = angular.module("Contacts_App16", ['ionic', 'PhoneGap', 'iLabBirthdayLine']);

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
                    templateUrl: 'templates/mid_project/helloFriends.html',
                    controller: 'HelloFriendsCtrl'
                }
            }
        })
        .state('tab.frienddetail', {
            url: "/frienddetail?id",
            views: {
                'tab-friends': {
                    templateUrl: 'templates/mid_project/friendDetail.html',
                    controller: 'FriendDetailCtrl'
                }
            }
        })
        .state('tab.newfriend', {
            url: "/newfriend",
            views: {
                'tab-friends': {
                    templateUrl: 'templates/mid_project/newFriend.html',
                    controller: 'NewFriendCtrl'
                }
            }
        })
        .state('tab.messagepage', {
            url: "/messagepage?id",
            views: {
                'tab-friends': {
                    templateUrl: 'templates/mid_project/messagePage.html',
                    controller: 'MessagePageCtrl'
                }
            }
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
        ;

    $urlRouterProvider.otherwise("/tab/friends");
});

app.run(function(DBManager, SettingManager, PushNotificationsFactory, iLabMessage, $window, PhoneGap, $rootScope,MessageManager) {
    var host = SettingManager.getHost();
    
    PhoneGap.ready(function() {
        if(host.phone) {
            $window.document.addEventListener("pause", function() {
                iLabMessage.resetCounter(host.phone);
            }, false);
        }
        onReceiveMessage();
    });
    
    $window.receiveMessage = function(message) {
        if(message.indexOf(':') < 0)
            return;
        $rootScope.$broadcast('mqtt.notification', message);
        console.log("mqtt.notification" + message);
    };
    
    if (host.registered) {
        PhoneGap.ready(function() {     
            $window.plugins.MQTTPlugin.CONNECT(angular.noop, angular.noop, host.phone, host.phone);
        });
    };
    
    var onReceiveMessage = function() {
        $rootScope.$on('mqtt.notification', function(event, res) {
            var index = res.indexOf(":");
            var phone = res.substring(0, index);
            var message = res.substring(index + 1, res.length);
            var msgObj = {};
            msgObj['targetPhone'] = phone;
            msgObj['content'] = message;
            msgObj['owner'] = 'target';
            MessageManager.add(msgObj);
            console.log("onReceiveMessage:" + message);
        });
    }
    
    var GCMSENDERID = '325215294371';
    
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