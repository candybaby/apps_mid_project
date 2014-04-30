app.factory('DBManager', function($window, PhoneGap) {
	var db = null;
    PhoneGap.ready(function() {
        db = $window.sqlitePlugin.openDatabase({name: "ActivityBookDB"});
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS friends(id INTEGER PRIMARY KEY ASC, name TEXT, phone TEXT UNIQUE, account TEXT UNIQUE, isActive BOOLEAN)", []);
        });
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS invitefriends(id INTEGER PRIMARY KEY ASC, name TEXT, phone TEXT UNIQUE, account TEXT UNIQUE, isActive BOOLEAN)", []);
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
                    tx.executeSql("INSERT INTO invitefriends(name, phone, account, isActive) VALUES (?, ?, ?, ?)",
                        [inviteFriend.name, inviteFriend.phone, inviteFriend.account, inviteFriend.isActive],
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
	                tx.executeSql("INSERT INTO friends(name, phone, account, isActive) VALUES (?, ?, ?, ?)",
	                    [friend.name, friend.phone, friend.account, friend.isActive],
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
                    tx.executeSql("UPDATE friends SET name = ?, phone = ?, account = ?, isActive = ? where id = ?",
                        [friend.name, friend.phone, friend.account, friend.isActive, friend.id],
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
        }

    };
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