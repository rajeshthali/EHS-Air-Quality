define([ 'angular', './services-module'], function(angular, sampleModule) {
	'use strict';
	sampleModule.factory('Config', [ '$http', '$rootScope', function($http, $rootScope) {
		return {
			
		
			/*Test*/
			 //baseUrl : 'http://localhost:9092' (http://localhost:9092%27) ,
			/*baseUrl : 'https://ehs-rmd-datasource-rajesh.run.aws-usw02-pr.ice.predix.io' (https://ehs-rmd-datasource-rajesh.run.aws-usw02-pr.ice.predix.io%27) ,			
			uaa : 'https://123rajesh.predix-uaa.run.aws-usw02-pr.ice.predix.io/oauth/token' (https://123rajesh.predix-uaa.run.aws-usw02-pr.ice.predix.io/oauth/token%27) ,
			clientId : 'Test_Rajesh',
			clientSecret : '123rajesh'*/
			baseUrl : 'https://ehs-datasource-floor-tcs-v3.run.aws-usw02-pr.ice.predix.io',
			 uaa : 'https://tcs-uaa.predix-uaa.run.aws-usw02-pr.ice.predix.io/oauth/token',
				clientId : 'ehs_tcs_client',
				clientSecret : 'ehs_uaa'
		};
	} ]);
});