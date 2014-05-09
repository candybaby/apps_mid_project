var app = angular.module("Contacts_App16", ['ionic', 'PhoneGap', 'acLabActivityBook']);

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	    .state('tab', {
	        url: "/tab",
	        abstract: true,
	        templateUrl: "templates/activity_book/tab.html"
	    })
        .state('tab.setting', {
            url: '/setting',
            views: {
                'tab-setting': {
                    templateUrl: 'templates/activity_book/setting/setting.html',
                    controller: 'SettingCtrl'
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
        .state('tab.newfriend', {
            url: "/newfriend",
            views: {
                'tab-friends': {
                    templateUrl: 'templates/activity_book/friend/newFriend.html',
                    controller: 'NewFriendCtrl'
                }
            }
        })
        .state('tab.chat', {
            url: '/chat',
            views: {
                'tab-chat': {
                    templateUrl: 'templates/activity_book/chat/chat.html',
                    controller: 'ChatCtrl'
                }
            }
        })
        .state('messagepage', {
            url: "/messagepage?account",
            templateUrl: 'templates/activity_book/chat/messagePage.html',
            controller: 'MessagePageCtrl'      
        })
        .state('tab.activity', {
            url: '/activity',
            views: {
                'tab-activity': {
                    templateUrl: 'templates/activity_book/activity/activity.html',
                    controller: 'ActivityCtrl'
                }
            }
        })
        .state('tab.newactivity', {
            url: '/newactivity',
            views: {
                'tab-activity': {
                    templateUrl: 'templates/activity_book/activity/newActivity.html',
                    controller: 'NewActivityCtrl'
                }
            }
        })
        ;
    $urlRouterProvider.otherwise("/tab/friends");
});

app.filter('fromNow', function() {
    return function(dateString) {
        return moment(dateString).fromNow();
    };
});

app.run(function(DBManager, SettingManager, PushNotificationsFactory, $window, PhoneGap, $rootScope, FriendManager, MessageManager, ChatManager, acLabMember) {
    var host = SettingManager.getHost();
    
    PhoneGap.ready(function() {
        if(host.phone) {
            $window.document.addEventListener("pause", function() {
                console.log("**** pause time ****");
                acLabMember.resetBadge(host.account);
            }, false);
            $window.document.addEventListener("backbutton", function() {
                console.log("**** backbutton time ****");
                // 不是很好 應該在離開app的時候 清空 但抓不到event
                acLabMember.resetBadge(host.account);
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
            $window.plugins.MQTTPlugin.CONNECT(angular.noop, angular.noop, host.phone, host.account);
            console.log("MQTTPlugin.CONNECT:" + host.account);
        });
    };
    
    var onReceiveMqtt = function() {
        $rootScope.$on('mqtt.notification', function(event, res) {
            // mqtt 傳幾則 收幾則 收到格式 json
            var message = JSON.parse(res);
            if (message['message_type'] == "chat") {
                receiveMessage(message);
            } else if (message['message_type'] == "read") {
                readMessage(message);
            } else if (message['message_type'] == "inviteFriend") {
                receiveInvitedFriendMessage(message);
            } else if (message['message_type'] == "acceptFriend") {
                receiveAcceptInvitedFriendMessage(message);
            } else if (message['message_type'] == "refuseFriend") {
                receiveRefuseInvitedFriendMessage(message);
            }
            
            console.log("mqtt onReceiveMqtt:" + res);
        });
    }

    var receiveMessage = function(message) {
        var msgObj = {};
        if (message['send_myself'] == true)
        {
            msgObj['owner'] = 'source';
            msgObj['fromAccount'] = message['receiverAccount'];
        }
        else
        {
            msgObj['owner'] = 'target';
            msgObj['fromAccount'] = message['senderAccount'];
            // if sender_phone 不是好友 做一個inviteFriend
        }
            
        msgObj['content'] = message['message'];
        msgObj['dateTime'] = message['date_time'];
        msgObj['mId'] = message['m_id'];
        msgObj['activityId'] = message['activity_id'] ? message['activity_id'] : 0;
        MessageManager.add(msgObj, function(messagesId) {
            var chat = {};
            var name = FriendManager.getByAccount(msgObj['fromAccount'])['name'];
            chat['fromAccount'] = msgObj['fromAccount'];
            chat['activityId'] = msgObj['activityId'];
            chat['title'] = name;
            chat['whoTalk'] = message['send_myself'] ? "我" : name;
            chat['message'] = msgObj['content'];
            chat['dateTime'] = msgObj['dateTime'];
            var isExist = ChatManager.isExist(chat['fromAccount'], chat['activityId']);
            if (isExist != false) {
                chat.id = isExist;
                var badge = ChatManager.getById(chat.id).badge;
                chat['badge'] = badge + 1;
                ChatManager.update(chat);
                console.log("chat update : " + isExist);
            } else {
                ChatManager.add(chat);
                console.log("chat add");
            }
            $rootScope.$broadcast('receiveMessage', message);
        });
    }

    var readMessage = function(message) {
        MessageManager.updateHasRead(message['message_id']);
        // console.log("readMessage:" + message['message_id']);
    }

    var receiveInvitedFriendMessage = function(message) {
        var friend = {};
        friend.name = message['name'];
        friend.phone = message['phone'];
        friend.account = message['account'];
        friend.isActive = 1;
        FriendManager.addInvitedFriend(friend);
    }

    var receiveAcceptInvitedFriendMessage = function(message) {
        var account = message['account'];
        // update friend isWaitingAccept = 0
        var friend = FriendManager.getByAccount(account);
        friend.isWaitingAccept = 0;
        FriendManager.update(friend);
        // FriendManager.addInvitedFriend(friend);
    }

    var receiveRefuseInvitedFriendMessage = function(message) {
        var account = message['account'];
        // delete friend
        var friend = FriendManager.getByAccount(account);
        FriendManager.remove(friend);
        // FriendManager.remove(friend);
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

    moment.lang('zh-tw');
});