
/* JavaScript content from js/mid_project/service.js in folder common */
app.factory('DBManager', function($window, PhoneGap) {
	var db = null;
    PhoneGap.ready(function() {
        db = $window.sqlitePlugin.openDatabase({name: "BirthdayLineDB"});
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS friends(id INTEGER PRIMARY KEY ASC, name TEXT, phone TEXT UNIQUE, email TEXT, birthday DATE, isMember BOOLEAN)", []);
        });
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS messages(id INTEGER PRIMARY KEY ASC, targetPhone TEXT, content TEXT, owner TEXT, dateTime DATETIME, hasRead BOOLEAN, mId INTEGER, activityId INTEGER)", []);
        });
    });
    
    return {
        addFriend: function (friend, onSuccess, onError) {
        	PhoneGap.ready(function() {
                if (friend.phone == "")
                    friend.phone = null;
                if (friend.phone != null)
                    friend.phone = friend.phone.replace(/-/g, "").replace(/ /g, "");
	            db.transaction(function(tx) {
	                tx.executeSql("INSERT INTO friends(name, phone, email, birthday, isMember) VALUES (?, ?, ?, ?, ?)",
	                    [friend.name, friend.phone, friend.email, friend.birthday, friend.isMember],
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
                    tx.executeSql("UPDATE friends SET name = ?, phone = ?, email = ?, birthday = ?, isMember = ? where id = ?",
                        [friend.name, friend.phone, friend.email, friend.birthday, friend.isMember, friend.id],
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
                    tx.executeSql("INSERT INTO messages(targetPhone, content, owner, dateTime, hasRead, mId, activityId) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        [message.targetPhone, message.content, message.owner, message.dateTime, false, message.mId, message.activityId],
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

        getMessagesByPhone: function (targetPhone, onSuccess, onError) {
            PhoneGap.ready(function() {
                db.transaction(function(tx) {
                    tx.executeSql("SELECT * FROM messages WHERE targetPhone=?", [targetPhone],
                        onSuccess,
                        onError
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
                        [true, mId],
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
        }
    };
});

app.factory('MessageManager', function(DBManager) {
    var idIndexMessages = {};
    DBManager.getMessages(function(tx, res) {
        for (var i = 0, max = res.rows.length; i < max; i++) {
            idIndexMessages[res.rows.item(i).id] = res.rows.item(i);
            console.log("message mId:" + res.rows.item(i).mId + "  hasRead:" + res.rows.item(i).hasRead);
        }
    });
    return {
        add: function(message) {
            DBManager.addMessage(message, function() {
                idIndexMessages[message.id] = message;
            });
        },
        getByPhone: function(phone) {
            var messagesByPhone = [];
            for (var id in idIndexMessages) {
                if (idIndexMessages[id].targetPhone == phone) {
                    messagesByPhone.push(idIndexMessages[id]);
                }
            }
            return messagesByPhone;
        },
        updateHasRead: function(mId) {
            DBManager.updateMessageHasRead(mId, function() {
                DBManager.getMessageId(mId, function(tx, res) {
                    var hasReadId = res.rows.item(0).id;
                    console.log("Message id:" + hasReadId);
                    idIndexMessages[hasReadId].hasRead = true;
                });
            });
        }
    }
});

app.factory('FriendManager', function(DBManager, acLabMember) {
    var idIndexedFriends = {};
    DBManager.getFriends(function(tx, res) {
        for (var i = 0, max = res.rows.length; i < max; i++) {
            idIndexedFriends[res.rows.item(i).id] = res.rows.item(i);
        } 
    });
    return {
        add: function(friend, onSuccess, onError) {
            acLabMember.isMember(friend.phone, function(response) {
                friend.isMember = JSON.parse(response) ? 1 : 0;
                DBManager.addFriend(friend, function() {
                    idIndexedFriends[friend.id] = friend;
                    (onSuccess || angular.noop)();
                }, onError);
            }, function() {
                friend.isMember = 0;
                DBManager.addFriend(friend, function() {
                    idIndexedFriends[friend.id] = friend;
                    (onSuccess || angular.noop)();
                }, onError);
            });
        },
        edit: function(friend, onSuccess, onError) {
            acLabMember.isMember(friend.phone, function(response) {
                friend.isMember = JSON.parse(response) ? 1 : 0;
                DBManager.updateFriend(friend, function() {
                    idIndexedFriends[friend.id] = friend;
                    (onSuccess || angular.noop)();
                }, onError);
            }, function() {
                friend.isMember = 0;
                DBManager.updateFriend(friend, function() {
                    idIndexedFriends[friend.id] = friend;
                    (onSuccess || angular.noop)();
                }, onError);
            });
        },
        remove: function(friend, onSuccess, onError) {
            DBManager.deleteFriend(friend, function() {
                delete idIndexedFriends[friend.id];
            }, onError);
        },
        getById: function(id) {
            return idIndexedFriends[id];
        },
        list: function() {
            return idIndexedFriends;
        },
        listMember: function() {
            // return friends with isMember: true
            var members = {};
            for (var id in idIndexedFriends) {
                if (idIndexedFriends[id].isMember)
                {
                    members[id] = idIndexedFriends[id];
                }
            }
            return members;
        },
        listFriend: function() {
            // return friends with isMember: false
            var friends = {};
            for (var id in idIndexedFriends) {
                if (!idIndexedFriends[id].isMember)
                {
                    friends[id] = idIndexedFriends[id];
                }
            }
            return friends;
        },
        count: function() {
            return Object.keys(idIndexedFriends).length;
        },
        countMember: function() {
            // return listMember count
            var members = {};
            for (var id in idIndexedFriends) {
                if (idIndexedFriends[id].isMember)
                {
                    members[id] = idIndexedFriends[id];
                }
            }
            return Object.keys(members).length;
        },
        countFriend: function() {
            // return listFriend count
            var friends = {};
            for (var id in idIndexedFriends) {
                if (!idIndexedFriends[id].isMember)
                {
                    friends[id] = idIndexedFriends[id];
                }
            }
            return Object.keys(friends).length;
        },
        updateIsMember: function() {
            // var tempIndexedFriends = angular.copy(idIndexedFriends);
            // for (var id in tempIndexedFriends) {
            // // 更新isMember
            //     console.log("updateIsMember id:" + id);
            //     var friend = tempIndexedFriends[id];
            //     console.log("updateIsMember friendid:" + friend.id);
            //     acLabMember.isMember(friend.phone, function(response) {
            //         friend.isMember = JSON.parse(response) ? 1 : 0;
            //         console.log("updateIsMember:" + friend.phone);
            //         console.log("updateIsMember:" + friend.isMember);
            //         DBManager.updateFriend(friend, function() {
            //             idIndexedFriends[friend.id] = friend;
            //             (onSuccess || angular.noop)();
            //         });
            //     });
            // }
        }
    };
  
});

app.factory('SettingManager', function($window) {
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