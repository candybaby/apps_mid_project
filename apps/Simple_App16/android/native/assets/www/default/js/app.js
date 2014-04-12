
/* JavaScript content from js/app.js in folder common */
var app = angular.module("Simple_App16", ['ionic']);

app.config( function($stateProvider, $urlRouterProvider) {
	$stateProvider
	    .state('tab', {
	        url: "/tab",
	        abstract: true,
	        templateUrl: "templates/03_hybrid/tab.html"
	    })
	    .state('tab.hellophonegap', {
          url: '/hellophonegap',
          views: {
              'tab-hellophonegap': {
                   templateUrl: 'templates/03_hybrid/helloPhoneGap.html',
                   controller: 'HelloPhoneGapCtrl'
              }
          }
	    });

  $urlRouterProvider.otherwise("/tab/hellophonegap");
});