
/* JavaScript content from js/activity_book/service.js in folder common */
app.factory('DBManager', function($window, PhoneGap) {
	var db = null;
    PhoneGap.ready(function() {
        db = $window.sqlitePlugin.openDatabase({name: "ActivityBookDB"});
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS friends(id INTEGER PRIMARY KEY ASC, name TEXT, phone TEXT, account TEXT UNIQUE, pictureUrl TEXT, isActive BOOLEAN, isWaitingAccept BOOLEAN, isInvited BOOLEAN)", []);
        });
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS messages(id INTEGER PRIMARY KEY ASC, fromAccount TEXT, content TEXT, owner TEXT, dateTime DATETIME, hasRead BOOLEAN, mId INTEGER UNIQUE, activityId INTEGER)", []);
        });
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS chat(id INTEGER PRIMARY KEY ASC, fromAccount TEXT, activityId INTEGER, title TEXT, whoTalk TEXT, message TEXT, dateTime DATETIME, badge INTEGER)", []);
        });
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS activity(id INTEGER PRIMARY KEY, name TEXT, describe TEXT, startTime DATETIME, endTime DATETIME, place TEXT, latlng TEXT, owner TEXT, status TEXT, eventId TEXT default '')", []);            
        });
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS activity_member(id INTEGER PRIMARY KEY ASC, activityId INTEGER, memberAccount TEXT, memberName TEXT, isJoin BOOLEAN)", []);            
        });
    });
    
    return {
        // 新增活動成員
        addActivityMember: function (people, onSuccess, onError) {
            PhoneGap.ready(function() {
                db.transaction(function(tx) {
                    tx.executeSql("INSERT INTO activity_member(activityId, memberAccount, memberName, isJoin) VALUES (?, ?, ?, ?)",
                        [people.activityId, people.memberAccount, people.memberName, people.isJoin],
                        function(tx, res) {
                            people.id = res.insertId;
                            (onSuccess || angular.noop)();
                        }, function (e) {
                            console.log("新增失敗：" + JSON.stringify(people));
                            (onError || angular.noop)(e);
                        }
                    );
                });
            });
        },

        updateActivityMember: function (people, onSuccess, onError) {
            PhoneGap.ready(function() {
                db.transaction(function (tx) {
                    tx.executeSql("UPDATE activity_member SET activityId = ?,memberAccount = ?, memberName = ?, isJoin = ? where id = ?",
                        [people.activityId, people.memberAccount, people.memberName, people.isJoin, people.id],
                        onSuccess,
                        onError
                    );
                });
            });
        },

        getActivityMember: function (onSuccess, onError) {
            PhoneGap.ready(function() {
                db.transaction(function(tx) {
                    tx.executeSql("SELECT * FROM activity_member", [],
                        onSuccess,
                        onError
                    );
                });
            });
        },

        // 新增活動
        addActivity: function (activity, onSuccess, onError) {
            PhoneGap.ready(function() {
                db.transaction(function(tx) {
                    tx.executeSql("INSERT INTO activity(id, name, describe, startTime, endTime, place, latlng, owner, status, eventId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        [activity.id, activity.name, activity.describe, activity.startTime, activity.endTime, activity.place, activity.latlng, activity.owner, activity.status, activity.eventId],
                        function(tx, res) {
                            (onSuccess || angular.noop)();
                        }, function (e) {
                            console.log("新增失敗：" + JSON.stringify(friend));
                            (onError || angular.noop)(e);
                        }
                    );
                });
            });
        },

        updateActivity: function (activity, onSuccess, onError) {
            PhoneGap.ready(function() {
                db.transaction(function (tx) {
                    tx.executeSql("UPDATE activity SET name = ?, describe = ?, startTime = ?, endTime = ?, place = ?, latlng = ?, owner = ?, status = ?, eventId = ? where id = ?",
                        [activity.name, activity.describe, activity.startTime, activity.endTime, activity.place, activity.latlng, activity.owner, activity.status, activity.eventId, activity.id],
                        onSuccess,
                        onError
                    );
                });
            });
        },

        getActivity: function (onSuccess, onError) {
            PhoneGap.ready(function() {
                db.transaction(function(tx) {
                    tx.executeSql("SELECT * FROM activity", [],
                        onSuccess,
                        onError
                    );
                });
            });
        },

        // 加入加朋友的 朋友資訊
        addFriend: function (friend, onSuccess, onError) {
        	PhoneGap.ready(function() {
                if (friend.phone == "")
                    friend.phone = null;
                if (friend.phone != null)
                    friend.phone = friend.phone.replace(/-/g, "").replace(/ /g, "");
	            db.transaction(function(tx) {
	                tx.executeSql("INSERT INTO friends(name, phone, account, pictureUrl, isActive, isWaitingAccept, isInvited) VALUES (?, ?, ?, ?, ?, ?, ?)",
	                    [friend.name, friend.phone, friend.account, friend.pictureUrl, friend.isActive, friend.isWaitingAccept, friend.isInvited],
	                    function(tx, res) {
	                		friend.id = res.insertId;
	                        (onSuccess || angular.noop)();
	                    }, function (e) {
	                        console.log('新增朋友失敗，原因: ' + e.message);
	    	            	console.log(JSON.stringify(friend));
	                        (onError || angular.noop)(e);
	                    }
	                );
	            });
        	});
        },
        
        updateFriend: function (friend, onSuccess, onError) {
        	PhoneGap.ready(function() {
                db.transaction(function (tx) {
                    tx.executeSql("UPDATE friends SET name = ?, phone = ?, account = ?, pictureUrl = ?, isActive = ?, isWaitingAccept = ?, isInvited = ? where id = ?",
                        [friend.name, friend.phone, friend.account, friend.pictureUrl, friend.isActive, friend.isWaitingAccept, friend.isInvited, friend.id],
                        onSuccess,
                        onError
	                );
	            });
        	});
        },
        
        deleteFriend: function (friend, onSuccess, onError) {
            db.transaction(function(tx) {
                tx.executeSql("delete from friends where id = ?", [friend.id],
                    onSuccess,
                    onError
                );
            });
        },
        
        getFriends: function (onSuccess, onError) {
        	PhoneGap.ready(function() {
        		db.transaction(function(tx) {
        			tx.executeSql("SELECT * FROM friends", [],
                        onSuccess,
                        onError
                    );
            	});
            });
        },

        addMessage: function (message, onSuccess, onError) {
            PhoneGap.ready(function() {
                db.transaction(function(tx) {
                    tx.executeSql("INSERT INTO messages(fromAccount, content, owner, dateTime, hasRead, mId, activityId) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        [message.fromAccount, message.content, message.owner, message.dateTime, 0, message.mId, message.activityId],
                        function(tx, res) {
                            message.id = res.insertId;
                            (onSuccess || angular.noop)();
                        }, function (e) {
                            console.log('新增訊息失敗，原因: ' + e.message);
                            console.log(JSON.stringify(message));
                            (onError || angular.noop)(e);
                        }
                    );
                });
            });
        },

        getMessages: function (onSuccess, onError) {
            PhoneGap.ready(function() {
                db.transaction(function(tx) {
                    tx.executeSql("SELECT * FROM messages", [],
                        onSuccess,
                        onError
                    );
                });
            });
        },

        updateMessageHasRead: function (mId, onSuccess, onError) {
            PhoneGap.ready(function() {
                db.transaction(function(tx) {
                    tx.executeSql("UPDATE messages SET hasRead = ? where mId = ?",
                        [1, mId],
                        onSuccess,
                        onError
                    );
                });
            });
        },

        getMessageId: function (mId, onSuccess, onError) {
            PhoneGap.ready(function() {
                db.transaction(function(tx) {
                    tx.executeSql("SELECT * FROM messages where mId = ?",
                        [mId],
                        onSuccess,
                        onError
                    );
                });
            });
        },

        addChat: function (chat, onSuccess, onError) {
            PhoneGap.ready(function() {
                db.transaction(function(tx) {
                    tx.executeSql("INSERT INTO chat(fromAccount, activityId, title, whoTalk, message, dateTime, badge) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        [chat.fromAccount, chat.activityId, chat.title, chat.whoTalk, chat.message, chat.dateTime, chat.badge],
                        function(tx, res) {
                            chat.id = res.insertId;
                            (onSuccess || angular.noop)();
                        }, function (e) {
                            console.log('新增訊息失敗，原因: ' + e.message);
                            console.log(JSON.stringify(message));
                            (onError || angular.noop)(e);
                        }
                    );
                });
            });
        },

        deleteChat: function (chat, onSuccess, onError) {
            db.transaction(function(tx) {
                tx.executeSql("delete from chat where id = ?", [chat.id],
                    onSuccess,
                    onError
                );
            });
        },

        getChats: function (onSuccess, onError) {
            PhoneGap.ready(function() {
                db.transaction(function(tx) {
                    tx.executeSql("SELECT * FROM chat", [],
                        onSuccess,
                        onError
                    );
                });
            });
        },

        updateChat: function (chat, onSuccess, onError) {
            PhoneGap.ready(function() {
                db.transaction(function(tx) {
                    tx.executeSql("UPDATE chat SET whoTalk = ?, message = ?, dateTime = ?,badge = ? where id = ?",
                        [chat.whoTalk, chat.message, chat.dateTime, chat.badge, chat.id],
                        onSuccess,
                        onError
                    );
                });
            });
        },

        updateChatBadge: function (badge, chatId, onSuccess, onError) {
            PhoneGap.ready(function() {
                db.transaction(function(tx) {
                    tx.executeSql("UPDATE chat SET badge = ? where id = ?",
                        [badge, chatId],
                        onSuccess,
                        onError
                    );
                });
            });
        },

        databaseReset: function (onSuccess, onError) {
            PhoneGap.ready(function() {
                db.transaction(function(tx) {
                    tx.executeSql("DROP TABLE friends");
                });
                db.transaction(function(tx) {
                    tx.executeSql("DROP TABLE messages");
                });
                db.transaction(function(tx) {
                    tx.executeSql("DROP TABLE chat");
                });
                db.transaction(function(tx) {
                    tx.executeSql("DROP TABLE activity");
                });
                db.transaction(function(tx) {
                    tx.executeSql("DROP TABLE activity_member", []);
                });

                // create
                db.transaction(function(tx) {
                    tx.executeSql("CREATE TABLE IF NOT EXISTS friends(id INTEGER PRIMARY KEY ASC, name TEXT, phone TEXT, account TEXT UNIQUE, pictureUrl TEXT, isActive BOOLEAN, isWaitingAccept BOOLEAN, isInvited BOOLEAN)", []);
                });
                db.transaction(function(tx) {
                    tx.executeSql("CREATE TABLE IF NOT EXISTS messages(id INTEGER PRIMARY KEY ASC, fromAccount TEXT, content TEXT, owner TEXT, dateTime DATETIME, hasRead BOOLEAN, mId INTEGER UNIQUE, activityId INTEGER)", []);
                });
                db.transaction(function(tx) {
                    tx.executeSql("CREATE TABLE IF NOT EXISTS chat(id INTEGER PRIMARY KEY ASC, fromAccount TEXT, activityId INTEGER, title TEXT, whoTalk TEXT, message TEXT, dateTime DATETIME, badge INTEGER)", []);
                });
                db.transaction(function(tx) {
                    tx.executeSql("CREATE TABLE IF NOT EXISTS activity(id INTEGER PRIMARY KEY, name TEXT, describe TEXT, startTime DATETIME, endTime DATETIME, place TEXT, latlng TEXT, owner TEXT, status TEXT, eventId TEXT default '')", []);            
                });
                db.transaction(function(tx) {
                    tx.executeSql("CREATE TABLE IF NOT EXISTS activity_member(id INTEGER PRIMARY KEY ASC, activityId INTEGER, memberAccount TEXT, memberName TEXT, isJoin BOOLEAN)", [], onSuccess);            
                });


            });
        },
    };
});

app.factory('ActivityMemberManager', function(DBManager) {
    var idIndexActivityMember = {};
    DBManager.getActivityMember(function(tx, res) {
        for (var i = 0, max = res.rows.length; i < max; i++) {
            idIndexActivityMember[res.rows.item(i).id] = res.rows.item(i);
            // for (var attrName in res.rows.item(i)) {
            //     console.log("ActivityMemberManager - "+attrName+" : "+res.rows.item(i)[attrName]);
            // }
        }
    });
    return {
        add: function(people, onSuccess) {
            DBManager.addActivityMember(people, function() {
                idIndexActivityMember[people.id] = people;
                (onSuccess || angular.noop)(people);
            });
        },
        list: function() {
            return idIndexActivityMember;
        },
        getById: function(id) {
            return idIndexActivityMember[id];
        },
        getByActivityId: function(activityId) {
            var memberByActivityId = [];
            for (var id in idIndexActivityMember) {
                if (idIndexActivityMember[id].activityId == activityId) {
                    memberByActivityId.push(idIndexActivityMember[id]);
                }
            }
            return memberByActivityId;
        },
        update: function(people, onSuccess) {
            DBManager.updateActivityMember(people, function() {
                idIndexActivityMember[people.id] = people;
                (onSuccess || angular.noop)();
            });
        },
        getByActivityIdAndAccount: function(activityId, account) {
            for (var id in idIndexActivityMember) {
                if (idIndexActivityMember[id].activityId == activityId && idIndexActivityMember[id].memberAccount == account) {
                    return idIndexActivityMember[id];
                }
            }
            return false;
        },
        reset: function() {
            idIndexActivityMember = {};
        },
    }
});


app.factory('ActivityManager', function(DBManager) {
    var idIndexActivity = {};
    DBManager.getActivity(function(tx, res) {
        for (var i = 0, max = res.rows.length; i < max; i++) {
            idIndexActivity[res.rows.item(i).id] = res.rows.item(i);
            // for (var attrName in res.rows.item(i)) {
            //     console.log("ActivityManager - "+attrName+" : "+res.rows.item(i)[attrName]);
            // }
        }
    });
    return {
        add: function(activity, onSuccess) {
            DBManager.addActivity(activity, function() {
                idIndexActivity[activity.id] = activity;
                (onSuccess || angular.noop)(activity);
            });
        },
        list: function() {
            return idIndexActivity;
        },
        listInvited: function() {
            var activityInvited = [];
            var now = moment();
            for (var id in idIndexActivity) {
                if (moment(idIndexActivity[id].startTime).diff(now) > 0 && idIndexActivity[id].status == 'Invited') {
                    activityInvited.push(idIndexActivity[id]);
                }
            }
            return activityInvited;
        },
        listNotStart: function() {
            var activityNotStart = [];
            var now = moment();
            for (var id in idIndexActivity) {
                if (moment(idIndexActivity[id].startTime).diff(now) > 0 && idIndexActivity[id].status != 'Invited') {
                    activityNotStart.push(idIndexActivity[id]);
                }
            }
            return activityNotStart;
        },
        listStarted: function() {
            var activityStarted = [];
            var now = moment();
            for (var id in idIndexActivity) {
                if (moment(idIndexActivity[id].startTime).diff(now) < 0 && moment(idIndexActivity[id].endTime).diff(now) > 0 && idIndexActivity[id].status != 'Invited') {
                    activityStarted.push(idIndexActivity[id]);
                }
            }
            return activityStarted;
        },
        listEnd: function() {
            var activityEnd = [];
            var now = moment();
            for (var id in idIndexActivity) {
                if (moment(idIndexActivity[id].endTime).diff(now) < 0) {
                    activityEnd.push(idIndexActivity[id]);
                }
            }
            return activityEnd;
        },
        getById: function(id) {
            if (idIndexActivity[id] == undefined) {
                return {};
            } else {
                return idIndexActivity[id];
            }
        },
        update: function(activity, onSuccess) {
            DBManager.updateActivity(activity, function() {
                idIndexActivity[activity.id] = activity;
                (onSuccess || angular.noop)();
            });
        },
        reset: function() {
            idIndexActivity = {};
        },
    }
});


app.factory('ChatManager', function(DBManager) {
    var idIndexChats = {};
    DBManager.getChats(function(tx, res) {
        for (var i = 0, max = res.rows.length; i < max; i++) {
            idIndexChats[res.rows.item(i).id] = res.rows.item(i);
            // for (var attrName in res.rows.item(i)) {
            //     console.log("ChatManager - "+attrName+" : "+res.rows.item(i)[attrName]);
            // }
        }
    });
    return {
        add: function(chat, onSuccess) {
            DBManager.addChat(chat, function() {
                idIndexChats[chat.id] = chat;
                (onSuccess || angular.noop)(chat.id);
            });
        },
        list: function() {
            return idIndexChats;
        },
        getById: function(id) {
            return idIndexChats[id];
        },
        isExist: function(account, activityId) {
            if (activityId != 0) {
                for (var id in idIndexChats) {
                    if (idIndexChats[id].activityId == activityId) {
                        return id;
                    }
                }
                return false;
            } else {
                for (var id in idIndexChats) {
                    if (idIndexChats[id].fromAccount == account) {
                        return id;
                    }
                }
                return false;
            }
        },
        update: function(chat, onSuccess) {
            DBManager.updateChat(chat, function() {
                idIndexChats[chat.id] = chat;
                (onSuccess || angular.noop)();
            });
        },
        resetBadge: function(id) {
            console.log("resetBadge id:" + id);
            DBManager.updateChatBadge(0, id, function() {
                idIndexChats[id].badge = 0;
            });
        },
        delete: function(chat, onSuccess, onError) {
            DBManager.deleteChat(chat, function(){
                delete idIndexChats[chat.id];
                (onSuccess || angular.noop)();
            }, onError);
        },
        reset: function() {
            idIndexChats = {};
        },
    }
});

app.factory('MessageManager', function(DBManager) {
    var idIndexMessages = {};
    DBManager.getMessages(function(tx, res) {
        for (var i = 0, max = res.rows.length; i < max; i++) {
            idIndexMessages[res.rows.item(i).id] = res.rows.item(i);
            for (var attrName in res.rows.item(i)) {
                console.log("MessageManager - "+attrName+" : "+res.rows.item(i)[attrName]);
            }
        }
    });
    return {
        add: function(message, onSuccess) {
            DBManager.addMessage(message, function() {
                idIndexMessages[message.id] = message;
                (onSuccess || angular.noop)(message);
            });
        },
        getByAccount: function(account) {
            var messagesByAccount = [];
            for (var id in idIndexMessages) {
                if (idIndexMessages[id].fromAccount == account) {
                    // var time = idIndexMessages[id].dateTime.split(" ");
                    // idIndexMessages[id].time = time[1];
                    // time format
                    messagesByAccount.push(idIndexMessages[id]);
                }
            }
            return messagesByAccount;
        },
        getBy: function(activityId, account) {
            var messages = [];
            for (var id in idIndexMessages) {
                if (idIndexMessages[id].activityId == activityId) {
                    if (activityId == 0) {
                        if (idIndexMessages[id].fromAccount == account) {
                            messages.push(idIndexMessages[id]);
                        }
                    } else {
                        messages.push(idIndexMessages[id]);
                    }
                }
                
            }
            return messages;
        },
        list: function() {
            return idIndexMessages;
        },
        getById: function(id) {
            return idIndexMessages[id];
        },
        updateHasRead: function(mId) {
            DBManager.updateMessageHasRead(mId, function() {
                DBManager.getMessageId(mId, function(tx, res) {
                    var hasReadId = res.rows.item(0).id;
                    idIndexMessages[hasReadId].hasRead = 1;
                });
            });
        },
        reset: function() {
            idIndexMessages = {};
        },
    }
});

app.factory('FriendManager', function(DBManager, ActivityMemberManager) {
    var idIndexFriends = {};
    DBManager.getFriends(function(tx, res) {
        for (var i = 0, max = res.rows.length; i < max; i++) {
            idIndexFriends[res.rows.item(i).id] = res.rows.item(i);
            // for (var attrName in res.rows.item(i)) {
            //     console.log("FriendManager - "+attrName+" : "+res.rows.item(i)[attrName]);
            // }
        }
    });
    return {
        addFriend: function(friend, onSuccess) {
            friend.isWaitingAccept = 0;
            friend.isInvited = 0;
            DBManager.addFriend(friend, function() {
                idIndexFriends[friend.id] = friend;
                (onSuccess || angular.noop)(friend);
            });
        },
        addWaitingAcceptFriend: function(friend) {
            friend.isWaitingAccept = 1;
            friend.isInvited = 0;
            DBManager.addFriend(friend, function() {
                idIndexFriends[friend.id] = friend;
            });
        },
        addInvitedFriend: function(friend) {
            friend.isWaitingAccept = 0;
            friend.isInvited = 1;
            DBManager.addFriend(friend, function() {
                idIndexFriends[friend.id] = friend;
            });
        },
        update: function(friend, onSuccess, onError) {
            DBManager.updateFriend(friend, function() {
                idIndexFriends[friend.id] = friend;
                (onSuccess || angular.noop)();
            }, onError);
        },
        remove: function(friend, onSuccess, onError) {
            DBManager.deleteFriend(friend, function() {
                delete idIndexFriends[friend.id];
                (onSuccess || angular.noop)();
            }, onError);
        },
        getByAccount: function(account, onSuccess, onError) {
            var friend;
            for (var id in idIndexFriends) {
                if (idIndexFriends[id].account == account) {
                    friend = idIndexFriends[id];
                }
            }
            if (friend == undefined) {
                return {};
            }
            return friend;
        },
        getById: function(id, onSuccess, onError) {
            return idIndexFriends[id];
        },
        listWaitingFriends: function() {
            var waitingFriends = {};
            for (var id in idIndexFriends) {
                if (idIndexFriends[id].isWaitingAccept && idIndexFriends[id].isActive)
                {
                    waitingFriends[id] = idIndexFriends[id];
                }
            }
            return waitingFriends;
        },
        listFriends: function() {
            var friends = {};
            for (var id in idIndexFriends) {
                if (!idIndexFriends[id].isInvited && !idIndexFriends[id].isWaitingAccept && idIndexFriends[id].isActive)
                {
                    friends[id] = idIndexFriends[id];
                }
            }
            return friends;
        },
        listCanInviteActivityFriends: function(activityId) {
            var friends = {};
            var inActivityFriends = ActivityMemberManager.getByActivityId(activityId);
            for (var id in idIndexFriends) {
                if (!idIndexFriends[id].isInvited && !idIndexFriends[id].isWaitingAccept && idIndexFriends[id].isActive)
                {
                    friends[id] = idIndexFriends[id];
                }
            }
            for (var index in inActivityFriends) {
                for (var id in friends) {
                    if (friends[id].account == inActivityFriends[index].memberAccount) {
                        delete friends[id];
                    }
                }
            }
            return friends;
        },
        listInvitedFriends: function() {
            var invitedFriends = {};
            for (var id in idIndexFriends) {
                if (idIndexFriends[id].isInvited && idIndexFriends[id].isActive)
                {
                    invitedFriends[id] = idIndexFriends[id];
                }
            }
            return invitedFriends;
        },
        count: function() {
            return Object.keys(idIndexFriends).length;
        },
        reset: function() {
            idIndexFriends = {};
        },
    }
});



app.factory('SettingManager', function($window) {
    console.log("SettingManager");
    if (!$window.localStorage['host'])
        $window.localStorage['host'] = "{}";
    return {
        setHost: function(host) {
            $window.localStorage['host'] = JSON.stringify(host);
        },
        getHost: function() {
            return JSON.parse($window.localStorage['host']);
        }
    };
});