var app = angular.module("Contacts_App16", ['ionic', 'PhoneGap', 'acLabActivityBook']);

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	    .state('tab', {
	        url: "/tab",
	        abstract: true,
	        templateUrl: "templates/activity_book/tab.html"
	    })
        .state('tab.register', {
            url: '/register',
            views: {
                'tab-setting': {
                    templateUrl: 'templates/activity_book/setting/register.html',
                    controller: 'RegisterCtrl'
                }
            }
        })
        .state('tab.friends', {
            url: '/friends',
            views: {
                'tab-friends': {
                    templateUrl: 'templates/activity_book/friend/helloFriends.html',
                    controller: 'HelloFriendsCtrl'
                }
            }
        })
        ;
    $urlRouterProvider.otherwise("/tab/friends");
});

app.run(function(DBManager, SettingManager, PushNotificationsFactory, $window, PhoneGap, $rootScope) {
    var host = SettingManager.getHost();
    
    PhoneGap.ready(function() {
        if(host.phone) {
            $window.document.addEventListener("pause", function() {
                console.log("**** pause time ****");
                //iLabMessage.resetCounter(host.phone);
            }, false);
        }
        onReceiveMqtt();
        //FriendManager.updateIsMember();
    });
    
    $window.receiveMessage = function(message) {
        if(message.length <= 0)
            return;
        $rootScope.$broadcast('mqtt.notification', message);
    };
    
    if (host.registered) {
        PhoneGap.ready(function() {     
            $window.plugins.MQTTPlugin.CONNECT(angular.noop, angular.noop, host.account, host.account);
            console.log("MQTTPlugin.CONNECT:" + host.account);
        });
    };
    
    var onReceiveMqtt = function() {
        $rootScope.$on('mqtt.notification', function(event, res) {
            // mqtt 傳幾則 收幾則 收到格式 json
            // var message = JSON.parse(res);
            // if (message['message_type'] == "chat") {
            //     receiveMessage(message);
            // } else if (message['message_type'] == "read") {
            //     readMessage(message);
            // } else if (message['message_type'] == "addFriend") {
            //     addFriendMessage(message);
            // }
            
            // console.log("mqtt onReceiveMqtt:" + res);
        });
    }

    var receiveMessage = function(message) {
        // var msgObj = {};
        // if (message['send_myself'] == true)
        // {
        //     msgObj['owner'] = 'source';
        //     msgObj['targetPhone'] = message['receiver_phone'];
        // }
        // else
        // {
        //     msgObj['owner'] = 'target';
        //     msgObj['targetPhone'] = message['sender_phone'];
        //     FriendManager.addBadgeCount(message['sender_phone']);
        //     // if sender_phone 不是好友 做一個inviteFriend
        //     FriendManager.isExistByPhone(message['sender_phone'], null, function() {
        //         var inviteFriend = {};
        //         inviteFriend.phone = message['sender_phone'];
        //         inviteFriend.name = message['sender_phone'];
        //         InviteFriendManager.add(inviteFriend);
        //     });
        // }
            
        // msgObj['content'] = message['message'];
        // msgObj['dateTime'] = message['date_time'];
        // msgObj['mId'] = message['m_id'];
        // msgObj['activityId'] = message['activity_id'];
        // MessageManager.add(msgObj, function() {
        //     $rootScope.$broadcast('receiveMessage', message);
        // });
    }

    var readMessage = function(message) {
        // MessageManager.updateHasRead(message['message_id']);
        // console.log("readMessage:" + message['message_id']);
    }

    var addFriendMessage = function(message) {
        // var inviteFriend = {};
        // inviteFriend.phone = message['sender_phone'];
        // inviteFriend.name = message['sender_name'];
        // FriendManager.isExistByPhone(inviteFriend.phone, null, function() {
        //     InviteFriendManager.add(inviteFriend);
        // });
    }
    
    var GCMSENDERID = '568888441927';
    
    PushNotificationsFactory(GCMSENDERID, function(token, type) {
        console.log("PushNotificationsFactory");
        var host = SettingManager.getHost();
        host.token = token;
        if (type == "GCM")
            host.type = 0;
        else if (type == "APNS")
            host.type = 1;
        SettingManager.setHost(host);
    });
});