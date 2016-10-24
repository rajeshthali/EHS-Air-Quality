define([ 'angular', './services-module'], function(angular, sampleModule) {
	'use strict';
	sampleModule.factory('Config', [ '$http', '$rootScope', function($http, $rootScope) {
		return {
			// baseUrl : 'http://localhost:9092',
			baseUrl : 'https://ehs-datasource-floor.run.aws-usw02-pr.ice.predix.io',
			uaa : 'https://72b6dc65-f16d-40bb-9b75-7e2dcd036dd7.predix-uaa.run.aws-usw02-pr.ice.predix.io/oauth/token',
			clientId : 'ehs-client',
			clientSecret : 'client'
		};
	} ]);
});