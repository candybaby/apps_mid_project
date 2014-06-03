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
                console.log("createActivity error，原因:"+response.error);
                (onError || angular.noop)(response);
            });
        },
        invite: function(friendArray, activityId, onSuccess, onError) {
            var inviteData = {
                invite_account: friendArray,
                activity_id: activityId
            };
            var invite = $http({
                method: 'POST',
                url: acLabServiceUrl + 'inviteFriends' + acLabServiceFormat,
                data: inviteData
            });
            
            invite.success(function(response, status, headers, config){
                console.log("Activity invite success" + response);
                (onSuccess || angular.noop)(response);
            });
            
            invite.error(function(response, status, headers, config) {
                console.log("Activity invite error，原因:"+response.error);
                (onError || angular.noop)(response);
            });
        },
        accept: function(account, activityId, onSuccess, onError) {
            var acceptData = {
                member_account: account,
                activity_id: activityId
            };
            var accept = $http({
                method: 'POST',
                url: acLabServiceUrl + 'accept' + acLabServiceFormat,
                data: acceptData
            });
            
            accept.success(function(response, status, headers, config){
                console.log("Activity accept success" + response);
                (onSuccess || angular.noop)(response);
            });
            
            accept.error(function(response, status, headers, config) {
                console.log("Activity accept error，原因:"+response.error);
                (onError || angular.noop)(response);
            });
        },
        refuse: function(account, activityId, onSuccess, onError) {
            var acceptData = {
                member_account: account,
                activity_id: activityId
            };
            var refuse = $http({
                method: 'POST',
                url: acLabServiceUrl + 'refuse' + acLabServiceFormat,
                data: acceptData
            });
            
            refuse.success(function(response, status, headers, config){
                console.log("Activity refuse success" + response);
                (onSuccess || angular.noop)(response);
            });
            
            refuse.error(function(response, status, headers, config) {
                console.log("Activity refuse error，原因:"+response.error);
                (onError || angular.noop)(response);
            });
        },
        sendPosition: function(positionInfo, onSuccess, onError) {
            var positionData = {
                activity_id: positionInfo.activityId,
                account: positionInfo.account,
                name: positionInfo.name,
                img_url: positionInfo.imgUrl,
                lat: positionInfo.lat,
                lng: positionInfo.lng
            };
            var sendPosition = $http({
                method: 'POST',
                url: acLabServiceUrl + 'sendPosition' + acLabServiceFormat,
                data: positionData
            });
            
            sendPosition.success(function(response, status, headers, config){
                console.log("Activity refuse success" + response);
                (onSuccess || angular.noop)(response);
            });
            
            sendPosition.error(function(response, status, headers, config) {
                console.log("Activity refuse error，原因:"+response.error);
                (onError || angular.noop)(response);
            });
        },
        closeMap: function(activityId, account, onSuccess, onError) {
            var positionData = {
                activity_id: activityId,
                account: account,
            };
            var closeMap = $http({
                method: 'POST',
                url: acLabServiceUrl + 'closeMap' + acLabServiceFormat,
                data: positionData
            });
            
            closeMap.success(function(response, status, headers, config){
                console.log("Activity refuse success" + response);
                (onSuccess || angular.noop)(response);
            });
            
            closeMap.error(function(response, status, headers, config) {
                console.log("Activity refuse error，原因:"+response.error);
                (onError || angular.noop)(response);
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

