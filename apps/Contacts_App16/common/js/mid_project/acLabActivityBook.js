angular.module('acLabActivityBook', ['PhoneGap']).factory('acLabActivity', function ($http, $window, PhoneGap, $rootScope) {
	var acLabServiceUrl = 'http://140.124.181.70/web/api/activity/';
    var acLabServiceFormat = '/format/json';
	
	return {
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