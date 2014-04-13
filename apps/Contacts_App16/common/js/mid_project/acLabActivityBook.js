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
});