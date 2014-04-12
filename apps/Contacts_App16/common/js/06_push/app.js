var app = angular.module("Contacts_App16", ['ionic', 'PhoneGap', 'iLabBirthdayLine']);

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	    .state('tab', {
	        url: "/tab",
	        abstract: true,
	        templateUrl: "templates/06_push/tab.html"
	    })
        .state('tab.friends', {
            url: '/friends',
            views: {
                'tab-friends': {
                    templateUrl: 'templates/06_push/helloFriends.html',
                    controller: 'HelloFriendsCtrl'
                }
            }
        })
        .state('tab.frienddetail', {
            url: "/frienddetail?id",
            views: {
                'tab-friends': {
                    templateUrl: 'templates/06_push/friendDetail.html',
                    controller: 'FriendDetailCtrl'
                }
            }
        })
        .state('tab.newfriend', {
            url: "/newfriend",
            views: {
                'tab-friends': {
                    templateUrl: 'templates/06_push/newFriend.html',
                    controller: 'NewFriendCtrl'
                }
            }
        })
        .state('tab.messagepage', {
            url: "/messagepage?id",
            views: {
                'tab-friends': {
                    templateUrl: 'templates/06_push/messagePage.html',
                    controller: 'MessagePageCtrl'
                }
            }
        })
        .state('tab.setting', {
            url: "/setting",
            views: {
                'tab-setting': {
                    templateUrl: 'templates/06_push/setting.html',
                    controller: 'SettingCtrl'
                }
            }
        })
        ;

    $urlRouterProvider.otherwise("/tab/friends");
});

app.run(function(SettingManager, PushNotificationsFactory) {
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