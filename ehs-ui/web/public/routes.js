/**
 * Router Config This is the router definition that defines all application
 * routes.
 */
define([ 'angular', 'angular-ui-router' ], function(angular) {
	'use strict';
	return angular.module('app.routes', [ 'ui.router' ]).config([ '$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

		// Turn on or off HTML5 mode which uses the # hash
		$locationProvider.html5Mode(true).hashPrefix('!');

		/**
		 * Router paths This is where the name of the route is matched to the
		 * controller and view template.
		 */
		$stateProvider.state('secure', {
			template : '<ui-view/>',
			abstract : true,
			resolve : {
				authenticated : [ '$q', 'PredixUserService', function($q, predixUserService) {
					var deferred = $q.defer();
					predixUserService.isAuthenticated().then(function(userInfo) {
						deferred.resolve(userInfo);
					}, function() {
						deferred.reject({
							code : 'UNAUTHORIZED'
						});
					});
					return deferred.promise;
				} ]
			}
		}).state('dashboards', {
			parent : 'secure',
			url : '/dashboards',
			templateUrl : 'views/dashboards-floor.html',
			controller : 'DashboardsCtrlFloor'
		})

		.state('asset_detail', {
			url : '/asset_detail',
			templateUrl : 'views/asset_detail.html',
			controller : 'AssetDetailCtrl'
		}).state('graph_demo', {
			url : '/graph_demo',
			templateUrl : 'views/garph_demo.html',
			controller : 'GraphCtrl'
		}).state('airquality', {
			url : '/airquality',
			templateUrl : 'views/aqi-floor.html',
			controller : 'AqiController',
			params : {
				'smtare' : null
			}
		  
		 
		}).state('detail_parameter', {
			url : '/detail_parameter',
			templateUrl : 'views/detail_parameter.html',
			controller : 'detilparaCtrl'
		}).state('aqi-details', {
			url : '/aqi-details',
			templateUrl : 'views/aqi-details-page.html',
			controller : 'AQIDetailsPageController',
			params : {
				'floor' : null,
				'type' : null,
				'assetName' : null
			}
		
		}).state('hygiene-details', {
			url : '/hygiene-details',
			templateUrl : 'views/hygiene-details-page.html',
			controller : 'HygieneDetailsPageController'
		})

		.state('detilpara', {
			url : '/detilgraph',
			templateUrl : 'views/detilgraph.html',
			controller : 'detilgraphCtrl'
		})

		.state('blanksubpage', {
			url : '/blanksubpage',
			templateUrl : 'views/blank-sub-page.html'
		}).state('industrial-hygiene', {
			url : '/industrial-hygiene',
			templateUrl : 'views/industrial-hygiene.html',
			controller : 'industrialHygiene'
		}).state('industrial-hygiene-details', {
			url : '/industrial-hygiene-details',
			templateUrl : 'views/industrial-hygiene-details.html',
			controller : 'industrialHygieneDetails'
		})

		$urlRouterProvider.otherwise(function($injector) {
			var $state = $injector.get('$state');
			document.querySelector('px-app-nav').markSelected('/dashboards');
			$state.go('dashboards');
		});

	} ]);
});