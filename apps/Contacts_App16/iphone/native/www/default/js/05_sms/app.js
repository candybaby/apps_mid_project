
/* JavaScript content from js/05_sms/app.js in folder common */
var app = angular.module("Contacts_App16", ['ionic', 'PhoneGap']);

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	    .state('tab', {
	        url: "/tab",
	        abstract: true,
	        templateUrl: "templates/05_sms/tab.html"
	    })
        .state('tab.hellosms', {
            url: '/hellosms',
            views: {
                'tab-hellosms': {
                    templateUrl: 'templates/05_sms/helloSMS.html',
                    controller: 'HelloSMSCtrl'
                }
            }
        })
        .state('tab.frienddetail', {
            url: "/frienddetail?id",
            views: {
                'tab-hellosms': {
                    templateUrl: 'templates/05_sms/friendDetail.html',
                    controller: 'FriendDetailCtrl'
                }
            }
        })
        .state('tab.newfriend', {
            url: "/newfriend",
            views: {
                'tab-hellosms': {
                    templateUrl: 'templates/05_sms/newFriend.html',
                    controller: 'NewFriendCtrl'
                }
            }
        })
        ;

    $urlRouterProvider.otherwise("/tab/hellosms");
});