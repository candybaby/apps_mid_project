
/* JavaScript content from js/03_contacts/app.js in folder common */
var app = angular.module("Contacts_App16", ['ionic']);

app.config( function($stateProvider, $urlRouterProvider) {
	$stateProvider
	    .state('tab', {
	        url: "/tab",
	        abstract: true,
	        templateUrl: "templates/03_contacts/tab.html"
	    })
	    .state('tab.friendlist', {
        	url: '/friendlist',
        	views: {
            	'tab-friendlist': {
                   templateUrl: 'templates/03_contacts/friendList.html',
                   controller: 'FriendListCtrl'
              }
          }
	    })
	    .state('tab.frienddetail', {
	    	url: "/frienddetail?name&phone&email&photo",
	    	views: {
	    		'tab-friendlist': {
	    			templateUrl: 'templates/03_contacts/friendDetail.html',
	    			controller: 'FriendDetailCtrl'
	    		}
	    	}
	    })
		;

  $urlRouterProvider.otherwise("/tab/friendlist");
});