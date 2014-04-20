app.factory('DBManager', function($window, PhoneGap) {
	var db = null;
    PhoneGap.ready(function() {
        db = $window.sqlitePlugin.openDatabase({name: "BirthdayLineDB"});
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS friends(id INTEGER PRIMARY KEY ASC, name TEXT, phone TEXT UNIQUE, email TEXT, birthday DATE, isMember BOOLEAN, badgeCount INTEGER)", []);
        });
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS messages(id INTEGER PRIMARY KEY ASC, targetPhone TEXT, content TEXT, owner TEXT, dateTime DATETIME, hasRead BOOLEAN, mId INTEGER, activityId INTEGER)", []);
        });
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS invitefriends(id INTEGER PRIMARY KEY ASC, name TEXT, phone TEXT UNIQUE)", []);
        });
    });
    
    return {
        addInviteFriend: function (inviteFriend, onSuccess, onError) {
            PhoneGap.ready(function() {
                if (inviteFriend.phone == "")
                    inviteFriend.phone = null;
                if (inviteFriend.phone != null)
                    inviteFriend.phone = inviteFriend.phone.replace(/-/g, "").replace(/ /g, "");
                db.transaction(function(tx) {
                    tx.executeSql("INSERT INTO invitefriends(name, phone) VALUES (?, ?)",
                        [inviteFriend.name, inviteFriend.phone],
                        function(tx, res) {
                            inviteFriend.id = res.insertId;
                            (onSuccess || angular.noop)();
                        }, function (e) {
                            console.log('新增朋友失敗，原因: ' + e.message);
                            console.log(JSON.stringify(inviteFriend));
                            (onError || angular.noop)(e);
                        }
                    );
                });
            });
        },

        deleteInviteFriend: function (friend, onSuccess, onError) {
            db.transaction(function(tx) {
                tx.executeSql("delete from invitefriends where id = ?", [friend.id],
                    onSuccess,
                    onError
                );
            });
        },

        getInviteFriends: function (onSuccess, onError) {
            PhoneGap.ready(function() {
                db.transaction(function(tx) {
                    tx.executeSql("SELECT * FROM invitefriends", [],
                        onSuccess,
                        onError
                    );
                });
            });
        },

        addFriend: function (friend, onSuccess, onError) {
        	PhoneGap.ready(function() {
                if (friend.phone == "")
                    friend.phone = null;
                if (friend.phone != null)
                    friend.phone = friend.phone.replace(/-/g, "").replace(/ /g, "");
	            db.transaction(function(tx) {
	                tx.executeSql("INSERT INTO friends(name, phone, email, birthday, isMember, badgeCount) VALUES (?, ?, ?, ?, ?, ?)",
	                    [friend.name, friend.phone, friend.email, friend.birthday, friend.isMember, friend.badgeCount],
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
                    tx.executeSql("UPDATE friends SET name = ?, phone = ?, email = ?, birthday = ?, isMember = ?, badgeCount = ? where id = ?",
                        [friend.name, friend.phone, friend.email, friend.birthday, friend.isMember, friend.badgeCount, friend.id],
                        onSuccess,
                        onError
	                );
	            });
        	});
        },

        updateBadgeCountByPhone: function (phone, badgeCount, onSuccess, onError) {
            PhoneGap.ready(function() {
                db.transaction(function (tx) {
                    tx.executeSql("UPDATE friends SET badgeCount = ? where phone = ?",
                        [badgeCount, phone],
                        onSuccess,
                        onError
                    );
                });
            });
        },

        updateIsMemberByPhone: function (phone, isMember, onSuccess, onError) {
            PhoneGap.ready(function() {
                db.transaction(function (tx) {
                    tx.executeSql("UPDATE friends SET isMember = ? where phone = ?",
                        [isMember, phone],
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

        getFriendByPhone: function (phone, onSuccess, onError) {
            PhoneGap.ready(function() {
                db.transaction(function(tx) {
                    tx.executeSql("SELECT * FROM friends where phone = ?",
                        [phone],
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
                        [message.targetPhone, message.content, message.owner, message.dateTime, 0, message.mId, message.activityId],
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
        }
    };
});

app.factory('InviteFriendManager', function(DBManager) {
    var idIndexInviteFriends = {};
    DBManager.getInviteFriends(function(tx, res) {
        for (var i = 0, max = res.rows.length; i < max; i++) {
            idIndexInviteFriends[res.rows.item(i).id] = res.rows.item(i);
        }
    });
    return {
        add: function(inviteFriend) {
            DBManager.addInviteFriend(inviteFriend, function() {
                idIndexInviteFriends[inviteFriend.id] = inviteFriend;
            });
        },
        remove: function(inviteFriend, onSuccess, onError) {
            DBManager.deleteInviteFriend(inviteFriend, function() {
                delete idIndexInviteFriends[inviteFriend.id];
            }, onError);
        },
        getById: function(id, onSuccess, onError) {
            return idIndexInviteFriends[id];
        },
        list: function() {
            return idIndexInviteFriends;
        },
        count: function() {
            return Object.keys(idIndexInviteFriends).length;
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
        add: function(message) {
            DBManager.addMessage(message, function() {
                idIndexMessages[message.id] = message;
            });
        },
        getByPhone: function(phone) {
            var messagesByPhone = [];
            for (var id in idIndexMessages) {
                if (idIndexMessages[id].targetPhone == phone) {
                    var time = idIndexMessages[id].dateTime.split(" ");
                    idIndexMessages[id].time = time[1];
                    // time format
                    messagesByPhone.push(idIndexMessages[id]);
                }
            }
            return messagesByPhone;
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
                friend.isMember = response.isMember ? 1 : 0;
                friend.badgeCount = 0;
                DBManager.addFriend(friend, function() {
                    idIndexedFriends[friend.id] = friend;
                    (onSuccess || angular.noop)(friend.phone);
                }, onError);
            }, function() {
                friend.isMember = 0;
                friend.badgeCount = 0;
                DBManager.addFriend(friend, function() {
                    idIndexedFriends[friend.id] = friend;
                    (onSuccess || angular.noop)();
                }, onError);
            });
        },
        edit: function(friend, onSuccess, onError) {
            acLabMember.isMember(friend.phone, function(response) {
                friend.isMember = response.isMember ? 1 : 0;
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
        badgeCount: function(id) {
            return idIndexedFriends[id].badgeCount;
        },
        addBadgeCount: function(phone) {
            DBManager.getFriendByPhone(phone, function(tx, res) {
                var friendId = res.rows.item(0).id;
                var preCount = idIndexedFriends[friendId].badgeCount;
                //console.log("pre" + preCount);
                DBManager.updateBadgeCountByPhone(phone, preCount + 1);
                idIndexedFriends[friendId].badgeCount = preCount + 1;
                //console.log("count" + idIndexedFriends[friendId].badgeCount);
            });
        },
        clearBadgeCount: function(phone) {
            DBManager.updateBadgeCountByPhone(phone, 0);
            DBManager.getFriendByPhone(phone, function(tx, res) {
                var friendId = res.rows.item(0).id;
                idIndexedFriends[friendId].badgeCount = 0;
            });
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
            var tempIndexedFriends = angular.copy(idIndexedFriends);
            var phoneList = [];
            for (var id in tempIndexedFriends) {
                phoneList.push(tempIndexedFriends[id].phone)
            }

            acLabMember.isMemberInputList(phoneList, function (response) {
                for (var phone in response)
                {
                    var isMember = response[phone] ? 1 : 0;
                    //console.log("test Res phone:" + phone + "isMember:" + isMember);
                    DBManager.updateIsMemberByPhone(phone, isMember);
                    DBManager.getFriendByPhone(phone, function(tx, res) {
                        var friendId = res.rows.item(0).id;
                        var isMember = res.rows.item(0).isMember;
                        idIndexedFriends[friendId].isMember = isMember;
                    });
                } 
            });
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