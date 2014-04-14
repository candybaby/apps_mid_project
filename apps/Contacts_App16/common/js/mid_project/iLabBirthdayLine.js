angular.module('iLabBirthdayLine', ['PhoneGap']).factory('iLabMessage', function ($http, $window, PhoneGap, $rootScope) {
	var iLabServiceUrl = 'http://140.124.183.158:7828/api/Message';
	
	return {
    	sendMessage: function(senderPhone, receiverPhone, message) {
    		var messageData = {
                SenderPhone: senderPhone,
                ReceiverPhone: receiverPhone,
                Message: message
            };
    		
    		var send = $http({
                method: 'POST',
                url: iLabServiceUrl,
                data: messageData
            });
    		
    		send.success(function(response, status, headers, config){
    			console.log("發送成功");
    		});
    		
    		send.error(function(response, status, headers, config) {
    		    console.log("發送失敗，原因:"+response);
    		});
        },
        resetCounter: function(phone) {
            var reset = $http({
                method: 'DELETE',
                url: iLabServiceUrl,
                params: {
                    phone: phone
                }
            });
            
            reset.success(function(response, status, headers, config){
                console.log("發送成功");
            });
            
            reset.error(function(response, status, headers, config) {
                console.log("發送失敗，原因:"+response);
            });
        }
    };
});

angular.module('iLabBirthdayLine').factory('iLabMember', function ($rootScope, $window, $http) {
	var acLabServiceUrl = 'http://140.124.181.70/web/api/member/';
    var acLabServiceFormat = '/format/json';
    
    return {
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