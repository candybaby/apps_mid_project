
/* JavaScript content from js/activity_book/service.js in folder common */
app.factory('DBManager', function($window, PhoneGap) {
	var db = null;
    PhoneGap.ready(function() {
        db = $window.sqlitePlugin.openDatabase({name: "ActivityBookDB"});
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS friends(id INTEGER PRIMARY KEY ASC, name TEXT, phone TEXT, account TEXT UNIQUE, isActive BOOLEAN, isWaitingAccept BOOLEAN, isInvited BOOLEAN)", []);
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
    };
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