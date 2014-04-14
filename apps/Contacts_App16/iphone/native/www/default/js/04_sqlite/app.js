
/* JavaScript content from js/04_sqlite/app.js in folder common */
var app = angular.module("Contacts_App16", ['ionic', 'PhoneGap']);

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	    .state('tab', {
	        url: "/tab",
	        abstract: true,
	        templateUrl: "templates/04_sqlite/tab.html"
	    })
        .state('tab.hellosqlite', {
            url: '/hellosqlite',
            views: {
                'tab-hellosqlite': {
                    templateUrl: 'templates/04_sqlite/helloSQLite.html',
                    controller: 'HelloSQLiteCtrl'
                }
            }
        })
        .state('tab.frienddetail', {
            url: "/frienddetail?id",
            views: {
                'tab-hellosqlite': {
                    templateUrl: 'templates/04_sqlite/friendDetail.html',
                    controller: 'FriendDetailCtrl'
                }
            }
        })
        .state('tab.newfriend', {
            url: "/newfriend",
            views: {
                'tab-newfriend': {
                    templateUrl: 'templates/04_sqlite/newFriend.html',
                    controller: 'NewFriendCtrl'
                }
            }
        })
        ;

    $urlRouterProvider.otherwise("/tab/hellosqlite");
});


app.factory('DBManager', function($window, PhoneGap) {
	var db = null;
    PhoneGap.ready(function() {

        db = $window.sqlitePlugin.openDatabase({name: "BirthdayLineDB"});
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS friends(id INTEGER PRIMARY KEY ASC, name TEXT, phone TEXT UNIQUE, email TEXT, birthday DATE)", []);
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
	                tx.executeSql("INSERT INTO friends(name, phone, email, birthday) VALUES (?, ?, ?, ?)",
	                    [friend.name, friend.phone, friend.email, friend.birthday],
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
                tx.executeSql("UPDATE friends SET name = ?, phone = ?, email = ?, birthday = ? where id = ?",
                    [friend.name, friend.phone, friend.email, friend.birthday, friend.id],
                    onSuccess,
                    onError
	                );
	            });
        	});
        },
        
        deleteFriend: function (id, onSuccess, onError) {
            db.transaction(function(tx) {
                tx.executeSql("delete from friends where id = ?", [id],
                    onSuccess,
                    onError
                );
            });
        },
        
        getFriends: function (onSuccess, onError) {
        	PhoneGap.ready(function() {
        		db.transaction(function(tx) {
        			tx.executeSql("SELECT * FROM friends", [], onSuccess, onError);
            	});
            });
        },

        getFriendById: function (id, onSuccess, onError) {
            PhoneGap.ready(function() {
                db.transaction(function(tx) {
                    tx.executeSql("SELECT * FROM friends where id = ?", [id], onSuccess, onError);
                });
            });
        }
    };
});