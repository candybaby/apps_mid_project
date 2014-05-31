
/* JavaScript content from js/activity_book/app.js in folder common */
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
            url: "/messagepage?account&activityId",
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
        .state('tab.activitydetail', {
            url: "/activitydetail?id",
            views: {
                'tab-activity': {
                    templateUrl: 'templates/activity_book/activity/activityDetail.html',
                    controller: 'ActivityDetailCtrl'
                }
            }
        })
        .state('tab.friendList', {
            url: "/friendList?id",
            views: {
                'tab-activity': {
                    templateUrl: 'templates/activity_book/activity/friendList.html',
                    controller: 'FriendListCtrl'
                }
            }
        })
        .state('tab.memberList', {
            url: "/memberList?id",
            views: {
                'tab-activity': {
                    templateUrl: 'templates/activity_book/activity/memberList.html',
                    controller: 'MemberListCtrl'
                }
            }
        })
        .state('map', {
            url: '/map?latitude&longitude&friendName&isMe',
            templateUrl: 'templates/activity_book/activity/map.html',
            controller: 'MapCtrl'
        })
        .state('chooselocationpage', {
            url: '/chooselocationpage',
            templateUrl: 'templates/activity_book/activity/chooseLocationPage.html',
            controller: 'ChooseLocationPageCtrl'
        })
        
        ;
    $urlRouterProvider.otherwise("/tab/friends");
});

app.service('sharedData', function () {
    var data = {
        place: "",
        latlng: ""
    };

    return {
        getData:function () {
            return data;
        },
        setData:function (value) {
            data = value;
        }
    };
});


app.filter('fromNow', function() {
    return function(dateString) {
        return moment(dateString).fromNow();
    };
});

app.filter('badgeCount', function() {
    return function(badgeNumber) {
        if (badgeNumber > 10) {
            return "10+";
        }
        return badgeNumber;
    };
});

app.filter('orderObjectBy', function() {
    return function(items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function(item) {
            filtered.push(item);
        });
        filtered.sort(function (a ,b) {
            return (a[field] > b[field] ? 1 : -1);
        });
        if (reverse) filtered.reverse();
        return filtered;
    };
});

app.filter('messageAdapter', function() {
    return function(messageString) {
        var result = messageString.replace(/\map:\([0-9.]+,[0-9.]+\)/, '');
        if (!result) {
            return '<img class="msgMap" src="images/mapImg.png"></img>';
        }
        return "";
    };
});

app.filter('chatContentAdapter', function() {
    return function(messageString) {
        var result = messageString.replace(/\map:\([0-9.]+,[0-9.]+\)/, '');
        if (!result) {
            return '傳送了自己的位置';
        }
        return result;
    };
});

app.filter('pictureUrlAdapter', function(FriendManager) {
    return function(account) {
        var url = FriendManager.getByAccount(account).pictureUrl;
        return url;
    };
});

app.run(function(DBManager, SettingManager, PushNotificationsFactory, $window, PhoneGap, $rootScope, FriendManager, MessageManager, ChatManager, acLabMember, ActivityManager, ActivityMemberManager) {
    var host = SettingManager.getHost();
    var fbAppId = '238880266302926';
    $window.openFB.init(fbAppId);

    
    PhoneGap.ready(function() {
        if(host.phone) {
            $window.document.addEventListener("pause", function() {
                console.log("**** pause time ****");
                acLabMember.resetBadge(host.account);
            }, false);
            $window.document.addEventListener("backbutton", function() {
                // 不是很好 應該在離開app的時候 清空 但抓不到event
                acLabMember.resetBadge(host.account);
                console.log("**** backbutton time ****");
                
            }, false);
        }
        // if(host.hasFB) {
        //     $window.openFB.login('user_friends');
        // }
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
            } else if (message['message_type'] == "inviteActivity") {
                receiveInvitedActivityMessage(message);
            } else if (message['message_type'] == "joinActivity") {
                receiveJoinActivityMessage(message);
            } else if (message['message_type'] == "refuseActivity") {
                receiveRefuseActivityMessage(message);
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
                chat['badge'] = message['send_myself'] ? badge : badge + 1;
                ChatManager.update(chat);
                console.log("chat update : " + isExist);
            } else {
                chat['badge'] = message['send_myself'] ? 0 : 1;
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
        friend.pictureUrl = message['pictureUrl'];
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

    var receiveInvitedActivityMessage = function(message) {
        var activity = {};
        activity = message;
        activity.status = "Invited";
        ActivityManager.add(activity);
        console.log("receiveInvitedActivityMessage Add member:");
        for (var index in activity.member) {
            console.log("Add Member" + activity.member[index].name);
            var people = activity.member[index];
            people.memberName = activity.member[index].name;
            ActivityMemberManager.add(people);
        }
    }

    var receiveJoinActivityMessage = function(message) {
        var people = ActivityMemberManager.getByActivityIdAndAccount(message['activity_id'], message['member_account']);
        if (people) {
            people.isJoin = true;
            ActivityMemberManager.update(people);//update
        } else {
            console.log("people false : " + message['member_account']);
        }
    }

    var receiveRefuseActivityMessage = function(message) {
        var people = ActivityMemberManager.getByActivityIdAndAccount(message['activity_id'], message['member_account']);
        if (people) {
            people.isJoin = false;
            ActivityMemberManager.update(people);//update
        } else {
            console.log("people false : " + message['member_account']);
        }
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