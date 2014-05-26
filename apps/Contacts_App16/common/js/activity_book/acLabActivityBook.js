angular.module('acLabActivityBook', ['PhoneGap']).factory('acLabActivity', function ($http, $window, PhoneGap, $rootScope) {
	var acLabServiceUrl = 'http://140.124.181.70/web/service/activity/';
    var acLabServiceFormat = '/format/json';
	
	return {
        add: function(activity, onSuccess, onError) {
            var activityData = {
                activity: activity
            };
            var add = $http({
                method: 'POST',
                url: acLabServiceUrl + 'add' + acLabServiceFormat,
                data: activityData
            });
            
            add.success(function(response, status, headers, config){
                console.log("createActivity success" + response);
                (onSuccess || angular.noop)(response);
            });
            
            add.error(function(response, status, headers, config) {
                console.log("createActivity error，原因:"+response);
                (onError || angular.noop)(response);
            });
        },
        getActivitiesByOwner: function(ownerPhone, onSuccess, onError) {
            var messageData = {
                owner: ownerPhone
            };
            
            var check = $http({
                method: 'POST',
                url: acLabServiceUrl + 'activities' + acLabServiceFormat,
                data: messageData
            });
            
            check.success(function(response, status, headers, config){
                console.log("getActivitiesByOwner success");
                (onSuccess || angular.noop)(response);
            });
            
            check.error(function(response, status, headers, config) {
                (onError || angular.noop)(false);
            });
        },
        getActivitiesByPhone: function(memberPhone, onSuccess, onError) {
            var messageData = {
                phone: memberPhone
            };
            
            var check = $http({
                method: 'POST',
                url: acLabServiceUrl + 'activities' + acLabServiceFormat,
                data: messageData
            });
            
            check.success(function(response, status, headers, config){
                console.log("getActivitiesByPhone success");
                (onSuccess || angular.noop)(response);
            });
            
            check.error(function(response, status, headers, config) {
                (onError || angular.noop)(false);
            });
        },
        getActivitiesById: function(id, onSuccess, onError) {
            var messageData = {
                id: id
            };
            
            var check = $http({
                method: 'POST',
                url: acLabServiceUrl + 'activities' + acLabServiceFormat,
                data: messageData
            });
            
            check.success(function(response, status, headers, config){
                console.log("getActivitiesById success");
                (onSuccess || angular.noop)(response);
            });
            
            check.error(function(response, status, headers, config) {
                (onError || angular.noop)(false);
            });
        },
        getActivities: function(onSuccess, onError) {
            var check = $http({
                method: 'GET',
                url: acLabServiceUrl + 'activities' + acLabServiceFormat,
            });
            check.success(function(response, status, headers, config){
                console.log("getActivities:" + response);
                (onSuccess || angular.noop)(response);
            });
            check.error(function (response, status, headers, config){
                (onError || angular.noop)(false);
            });
        }
    };
})
.factory('acLabMessage', function ($http, $window, PhoneGap, $rootScope) {
    var acLabServiceUrl = 'http://140.124.181.70/web/service/message/';
    var acLabServiceFormat = '/format/json';
    
    return {
        sendMessage: function(senderAccount, receiverAccount, message, activityId) {
            var messageData = {
                sender_account: senderAccount,
                receiver_account: receiverAccount,
                message: message,
                activity_id: activityId
            };
            
            var send = $http({
                method: 'POST',
                url: acLabServiceUrl + "send" + acLabServiceFormat,
                data: messageData
            });
            
            send.success(function(response, status, headers, config){
                console.log("發送成功");
            });
            
            send.error(function(response, status, headers, config) {
                console.log("發送失敗，原因:"+response);
            });
        },
        readMessage: function(mId) {
            var messageData = {
                m_id: mId
            };
            
            var send = $http({
                method: 'POST',
                url: acLabServiceUrl + "read" + acLabServiceFormat,
                data: messageData
            });
            
            send.success(function(response, status, headers, config){
                console.log("發送成功");
            });
            
            send.error(function(response, status, headers, config) {
                console.log("發送失敗，原因:"+response);
            });
        },
    };
});


angular.module('acLabActivityBook').factory('acLabMember', function ($rootScope, $window, $http) {
    var acLabServiceUrl = 'http://140.124.181.70/web/service/member/';
    var acLabServiceFormat = '/format/json';
    
    return {
        authRequest: function(account, onSuccess, onError) {
            var data = {
                account: account
            };

            var auth = $http({
                method: 'POST',
                url: acLabServiceUrl + 'authRequest' + acLabServiceFormat,
                data: data
            });
                
            auth.success(function(response, status, headers, config){
                (onSuccess || angular.noop)(response);
            });
                
            auth.error(function (response, status, headers, config){
                (onError || angular.noop)(response);
            });
        },

        authCheck: function(account, code, onSuccess, onError) {
            var data = {
                account: account,
                code: code
            };

            var auth = $http({
                method: 'POST',
                url: acLabServiceUrl + 'authCheck' + acLabServiceFormat,
                data: data
            });
                
            auth.success(function(response, status, headers, config){
                (onSuccess || angular.noop)(response);
            });
                
            auth.error(function (response, status, headers, config){
                (onError || angular.noop)();
            });
        },

        register: function(host, onSuccess, onError) {
            for (var attrName in host) {
             console.log("register - "+attrName+" : "+host[attrName]);
            }
            var hostData = {
                account: host.account,
                phone: host.phone,
                name: host.name,
                pictureUrl: host.pictureUrl,
                deviceType: host.type,
                token: host.token,
                FBid: host.FBid
            };
                
            var add = $http({
                method: 'POST',
                url: acLabServiceUrl + 'register' + acLabServiceFormat,
                data: hostData
            });
                
            add.success(function(response, status, headers, config){
                (onSuccess || angular.noop)(response);
            });
                
            add.error(function (response, status, headers, config){
                (onError || angular.noop)(response);
            });
        },

        update: function(host, onSuccess, onError) {
            for (var attrName in host) {
                console.log("update - "+attrName+" : "+host[attrName]);
            }
            var hostData = {
                account: host.account,
                phone: host.phone,
                name: host.name,
                pictureUrl: host.pictureUrl,
                deviceType: host.type,
                token: host.token,
                FBid: host.FBid
            };
                
            var update = $http({
                method: 'POST',
                url: acLabServiceUrl + 'update' + acLabServiceFormat,
                data: hostData
            });
                
            update.success(function(response, status, headers, config){
                (onSuccess || angular.noop)(response);
            });
                
            update.error(function (response, status, headers, config){
                (onError || angular.noop)(response);
            });
        },
        
        unregister: function(account, onSuccess, onError) {
            var data = {
                account: account
            };

            var remove = $http({
                method: 'POST',
                url: acLabServiceUrl + 'unregister' + acLabServiceFormat,
                data: data
            });

            remove.success(function(response, status, headers, config){
                (onSuccess || angular.noop)(response);
            });
            remove.error(function (response, status, headers, config){
                (onError || angular.noop)(response);
            });
        },

        resetBadge: function(account, onSuccess, onError) {
            var data = {
                account: account
            };

            var reset = $http({
                method: 'POST',
                url: acLabServiceUrl + 'resetBadge' + acLabServiceFormat,
                data: data
            });

            reset.success(function(response, status, headers, config){
                (onSuccess || angular.noop)(response);
            });
            reset.error(function (response, status, headers, config){
                (onError || angular.noop)(response);
            });
        }
    };
})
.factory('acLabFriend', function ($rootScope, $window, $http) {
    var acLabServiceUrl = 'http://140.124.181.70/web/service/friend/';
    var acLabServiceFormat = '/format/json';
    
    return {
        search: function(text, account, onSuccess, onError) {
            console.log("search" + text);
            var data = {
                text: text,
                account: account
            };

            var search = $http({
                method: 'POST',
                url: acLabServiceUrl + 'search' + acLabServiceFormat,
                data: data
            });
                
            search.success(function(response, status, headers, config){
                (onSuccess || angular.noop)(response);
            });
                
            search.error(function (response, status, headers, config){
                (onError || angular.noop)(response);
            });
        },

        searchByFB: function(FBids, account, onSuccess, onError) {
            var data = {
                FBids: FBids,
                account: account
            };

            var searchByFB = $http({
                method: 'POST',
                url: acLabServiceUrl + 'searchByFB' + acLabServiceFormat,
                data: data
            });
                
            searchByFB.success(function(response, status, headers, config){
                (onSuccess || angular.noop)(response);
            });
                
            searchByFB.error(function (response, status, headers, config){
                (onError || angular.noop)(response);
            });
        },

        add: function(account, friendAccount, onSuccess, onError) {
            var data = {
                account: account,
                friend_account: friendAccount
            };

            var add = $http({
                method: 'POST',
                url: acLabServiceUrl + 'add' + acLabServiceFormat,
                data: data
            });

            add.success(function(response, status, headers, config){
                (onSuccess || angular.noop)(response);
            });
            add.error(function (response, status, headers, config){
                (onError || angular.noop)(response);
            });
        },

        accept: function(account, friendAccount, onSuccess, onError) {
            var data = {
                account: account,
                friend_account: friendAccount
            };

            var accept = $http({
                method: 'POST',
                url: acLabServiceUrl + 'accept' + acLabServiceFormat,
                data: data
            });

            accept.success(function(response, status, headers, config){
                (onSuccess || angular.noop)(response);
            });
            accept.error(function (response, status, headers, config){
                (onError || angular.noop)(response);
            });
        },

        refuse: function(account, friendAccount, onSuccess, onError) {
            var data = {
                account: account,
                friend_account: friendAccount
            };

            var refuse = $http({
                method: 'POST',
                url: acLabServiceUrl + 'refuse' + acLabServiceFormat,
                data: data
            });

            refuse.success(function(response, status, headers, config){
                (onSuccess || angular.noop)(response);
            });
            refuse.error(function (response, status, headers, config){
                (onError || angular.noop)(response);
            });
        },
    };
});

