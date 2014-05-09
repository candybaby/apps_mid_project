
/* JavaScript content from js/activity_book/service.js in folder common */
app.factory('DBManager', function($window, PhoneGap) {
	var db = null;
    PhoneGap.ready(function() {
        db = $window.sqlitePlugin.openDatabase({name: "ActivityBookDB"});
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS friends(id INTEGER PRIMARY KEY ASC, name TEXT, phone TEXT, account TEXT UNIQUE, isActive BOOLEAN, isWaitingAccept BOOLEAN, isInvited BOOLEAN)", []);
        });
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS messages(id INTEGER PRIMARY KEY ASC, fromAccount TEXT, content TEXT, owner TEXT, dateTime DATETIME, hasRead BOOLEAN, mId INTEGER, activityId INTEGER)", []);
        });
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS chat(id INTEGER PRIMARY KEY ASC, fromAccount TEXT, activityId INTEGER, title TEXT, whoTalk TEXT, message TEXT, dateTime DATETIME, badge INTEGER)", []);
        });
    });
    
    return {
        // 加入加朋友的 朋友資訊
        addFriend: function (friend, onSuccess, onError) {
        	PhoneGap.ready(function() {
                if (friend.phone == "")
                    friend.phone = null;
                if (friend.phone != null)
                    friend.phone = friend.phone.replace(/-/g, "").replace(/ /g, "");
	            db.transaction(function(tx) {
	                tx.executeSql("INSERT INTO friends(name, phone, account, isActive, isWaitingAccept, isInvited) VALUES (?, ?, ?, ?, ?, ?)",
	                    [friend.name, friend.phone, friend.account, friend.isActive, friend.isWaitingAccept, friend.isInvited],
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
                    tx.executeSql("UPDATE friends SET name = ?, phone = ?, account = ?, isActive = ?, isWaitingAccept = ?, isInvited = ? where id = ?",
                        [friend.name, friend.phone, friend.account, friend.isActive, friend.isWaitingAccept, friend.isInvited, friend.id],
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
                        [chat.fromAccount, chat.activityId, chat.title, chat.whoTalk, chat.message, chat.dateTime, 1],
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
    };
});

app.factory('ChatManager', function(DBManager) {
    var idIndexChats = {};
    DBManager.getChats(function(tx, res) {
        for (var i = 0, max = res.rows.length; i < max; i++) {
            idIndexChats[res.rows.item(i).id] = res.rows.item(i);
            for (var attrName in res.rows.item(i)) {
                console.log("ChatManager - "+attrName+" : "+res.rows.item(i)[attrName]);
            }
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
        }
    }
});

app.factory('MessageManager', function(DBManager) {
    var idIndexMessages = {};
    DBManager.getMessages(function(tx, res) {
        for (var i = 0, max = res.rows.length; i < max; i++) {
            idIndexMessages[res.rows.item(i).id] = res.rows.item(i);
        }
    });
    return {
        add: function(message, onSuccess) {
            DBManager.addMessage(message, function() {
                idIndexMessages[message.id] = message;
                (onSuccess || angular.noop)(message.id);
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
        }
    }
});

app.factory('FriendManager', function(DBManager) {
    var idIndexFriends = {};
    DBManager.getFriends(function(tx, res) {
        for (var i = 0, max = res.rows.length; i < max; i++) {
            idIndexFriends[res.rows.item(i).id] = res.rows.item(i);
        }
    });
    return {
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
        }
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