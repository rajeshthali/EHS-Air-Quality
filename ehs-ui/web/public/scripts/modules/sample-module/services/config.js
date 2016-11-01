define([ 'angular', './services-module'], function(angular, sampleModule) {
	'use strict';
	sampleModule.factory('Config', [ '$http', '$rootScope', function($http, $rootScope) {
		return {
			 baseUrl : 'http://localhost:9092',
			//baseUrl : 'https://ehs-datasource-floor.run.aws-usw02-pr.ice.predix.io',
			uaa : 'https://123rajesh.predix-uaa.run.aws-usw02-pr.ice.predix.io/oauth/token',
			clientId : 'Test_Rajesh',
			clientSecret : '123rajesh'
		};
	} ]);
});