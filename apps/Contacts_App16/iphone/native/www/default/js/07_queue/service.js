
/* JavaScript content from js/07_queue/service.js in folder common */
app.factory('DBManager', function($window, PhoneGap) {
	var db = null;
    PhoneGap.ready(function() {
        db = $window.sqlitePlugin.openDatabase({name: "BirthdayLineDB"});
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS friends(id INTEGER PRIMARY KEY ASC, name TEXT, phone TEXT UNIQUE, email TEXT, birthday DATE, isMember BOOLEAN)", []);
        });
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS messages(id INTEGER PRIMARY KEY ASC, targetPhone TEXT, content TEXT, owner TEXT)", []);
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
                    tx.executeSql("INSERT INTO messages(targetPhone, content, owner) VALUES (?, ?, ?)",
                        [message.targetPhone, message.content, message.owner],
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
        }
    };
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
                    messagesByPhone.push(idIndexMessages[id]);
                }
            }
            return messagesByPhone;
        }
    }
});

app.factory('FriendManager', function(DBManager, iLabMember) {
    var idIndexedFriends = {};
    var phoneIndexedFriends = {};
    DBManager.getFriends(function(tx, res) {
        for (var i = 0, max = res.rows.length; i < max; i++) {
            idIndexedFriends[res.rows.item(i).id] = res.rows.item(i);
        }
    });
    return {
        add: function(friend, onSuccess, onError) {
            iLabMember.isMember(friend.phone, function(response) {
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
            iLabMember.isMember(friend.phone, function(response) {
                friend.isMember = JSON.parse(response) ? 1 : 0;
                DBManager.updateFriend(friend, function() {
                    idIndexedFriends[friend.id] = friend;
                    phoneIndexedFriends[friend.phone] = friend;
                    (onSuccess || angular.noop)();
                }, onError);
            }, function() {
                friend.isMember = 0;
                DBManager.updateFriend(friend, function() {
                    idIndexedFriends[friend.id] = friend;
                    phoneIndexedFriends[friend.phone] = friend;
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
        getByPhone: function(phone) {
            if (phoneIndexedFriends[phone] == undefined) {
                for (var id in idIndexedFriends) {
                    if (idIndexedFriends[id].phone == phone) {
                        phoneIndexedFriends[phone] = idIndexedFriends[id];
                        break;
                    }
                }
            }
            return phoneIndexedFriends[phone];
        },
        list: function() {
            return idIndexedFriends;
        },
        count: function() {
            return Object.keys(idIndexedFriends).length;
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