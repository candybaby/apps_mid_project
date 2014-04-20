angular.module('acLabActivityBook', ['PhoneGap']).factory('acLabActivity', function ($http, $window, PhoneGap, $rootScope) {
	var acLabServiceUrl = 'http://140.124.181.70/web/api/activity/';
    var acLabServiceFormat = '/format/json';
	
	return {
        createActivity: function(activity) {
            var check = $http({
                method: 'POST',
                url: acLabServiceUrl + 'newActivity' + acLabServiceFormat,
                data: activity
            });
            
            check.success(function(response, status, headers, config){
                console.log("createActivity success");
            });
            
            check.error(function(response, status, headers, config) {
                console.log("createActivity error，原因:"+response);
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
    var acLabServiceUrl = 'http://140.124.181.70/web/api/message/';
    var acLabServiceFormat = '/format/json';
    
    return {
        sendMessage: function(senderPhone, receiverPhone, message, activityId) {
            var messageData = {
                sender_phone: senderPhone,
                receiver_phone: receiverPhone,
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
    var acLabServiceUrl = 'http://140.124.181.70/web/api/member/';
    var acLabServiceFormat = '/format/json';
    
    return {
        sendInvite: function(senderPhone, senderName, receiverPhone, onSuccess, onError) {
            var data = {
                sender_phone: senderPhone,
                sender_name: senderName,
                receiver_phone: receiverPhone
            };

            var check = $http({
                method: 'POST',
                url: acLabServiceUrl + 'test' + acLabServiceFormat,
                data: data
            });

            check.success(function(response, status, headers, config){
                (onSuccess || angular.noop)(response);
            });
            check.error(function (response, status, headers, config){
                (onError || angular.noop)(false);
            });
        },

        isMemberInputList: function(phoneList, onSuccess, onError) {
            var data = {
                phone: phoneList
            };

            var check = $http({
                method: 'POST',
                url: acLabServiceUrl + 'isExistInputList' + acLabServiceFormat,
                data: data
            });

            check.success(function(response, status, headers, config){
                (onSuccess || angular.noop)(response);
            });
            check.error(function (response, status, headers, config){
                (onError || angular.noop)(false);
            });
        },

        isMember: function(phone, onSuccess, onError) {
            var data = {
                phone: phone
            };

            var check = $http({
                method: 'POST',
                url: acLabServiceUrl + 'isExist' + acLabServiceFormat,
                data: data
            });

            check.success(function(response, status, headers, config){
                (onSuccess || angular.noop)(response);
            });
            check.error(function (response, status, headers, config){
                (onError || angular.noop)(false);
            });
        },
        
        register: function(host, onSuccess, onError) {
            var hostData = {
                phone: host.phone,
                device_type: host.type,
                token: host.token
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
                (onError || angular.noop);
            });
        },
        
        unregister: function(phone, onSuccess, onError) {
            var data = {
                phone: phone
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
                (onError || angular.noop)(false);
            });
        }
    };
});
