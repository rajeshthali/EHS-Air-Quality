/**
 * Load controllers, directives, filters, services before bootstrapping the
 * application. NOTE: These are named references that are defined inside of the
 * config.js RequireJS configuration file.
 */
define([ 'jquery', 
         'angular',
         'angular-route',
         'routes', 
         
         /*'controller/main',
         'directives/main',
         'filters/main',
         'services/main',*/
         'modules/sample-module/controller/main',
         'modules/sample-module/directives/main',
         'modules/sample-module/filters/main',
         'modules/sample-module/services/main',
         
         
         'interceptors', 
         'px-datasource', 
         'ng-bind-polymer'
         ], function($, angular) {
	'use strict';

	/**
	 * Application definition This is where the AngularJS application is defined
	 * and all application dependencies declared.
	 * 
	 * @type {module}
	 */
	var predixApp = angular.module('predixApp', [ 'app.routes', 
	                                              'app.interceptors',
	                                              /*'sample.module',*/
	                                              
	                                              'app.controllers',
	                                              'app.directives',
	                                              'app.filters',
	                                              'app.services',
	                                              
	                                              'predix.datasource',
	                                              'px.ngBindPolymer' 
	                                              ]);

	/**
	 * Main Controller This controller is the top most level controller that
	 * allows for all child controllers to access properties defined on the
	 * $rootScope.
	 */
	predixApp.controller('MainCtrl', [ '$scope', '$rootScope', 'PredixUserService', function($scope, $rootScope, predixUserService) {

		// Global application object
		window.App = $rootScope.App = {
			version : '1.0',
			name : 'Predix Seed',
			session : {},
			tabs : [

			{
				icon : 'fa-tachometer',
				state : 'dashboards',
				label : 'Compliance Dashboards'
			},
			/*
			 * {icon: 'fa-tachometer', state: 'asset_detail', label: 'Asset
			 * Details'}, {icon: 'fa-tachometer', state: 'graph_demo', label:
			 * 'Graph'},
			 */
			{
				icon : 'fa-cloud',
				state : 'airquality',
				label : 'Air quality Monitoring',
				subitems : [
				/* {state: 'blanksubpage', label: 'Blank Sub Page'} */
				]
			}, {
				icon : 'fa-industry',
				state : 'industrial-hygiene',
				label : 'Hygiene Monitoring',
				subitems : [
				/* {state: 'blanksubpage', label: 'Blank Sub Page'} */
				]
			} ,
			{    
				   icon: 'fa-tint fa-lg', 
				   state: 'water-discharge', 
			       label: 'Water Consumption',
			       subitems: [
			     ]
			},
			{    
				   icon: 'fa-plug', 
				   state: 'Energy-Management', 
			       label: 'Energy Management', 
			       subitems: [
			    ]
			},
			{    
				   icon: 'fa-recycle', 
				   state: 'Waste-Management', 
			       label: 'Waste Management', 
			       subitems: [
			    ]
			},
			{    
				   icon: 'fa-signal', 
				   state: 'Sensor-Data', 
			       label: 'Real Time Sensor', 
			       subitems: [
			           /*{state: 'blanksubpage', label: 'Blank Sub Page'}*/
			    ]
			},
			
			 ]
        };


		$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
			if (angular.isObject(error) && angular.isString(error.code)) {
				switch (error.code) {
				case 'UNAUTHORIZED':
					// redirect
					predixUserService.login(toState);
					break;
				default:
					// go to other error state
				}
			} else {
				// unexpected error
			}
		});
	} ]);

	// Set on window for debugging
	window.predixApp = predixApp;

	// Return the application object
	return predixApp;
});
