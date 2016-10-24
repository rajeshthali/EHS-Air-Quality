define([ 'angular', './services-module'], function(angular, sampleModule) {
	'use strict';
	sampleModule.factory('AuthService', [ '$http', '$rootScope', 'Config', function($http, $rootScope, Config) {
		return {
			getTocken : function(cb) {
				$http({
					method : 'GET',
					url : Config.uaa + '?grant_type=client_credentials&client_id=' + Config.clientId,
					headers : {
						'Authorization' : 'Basic ' + btoa(Config.clientId + ':' + Config.clientSecret)
					}
				}).success(function(data) {
					$rootScope.token = 'Bearer ' + data.access_token;
					if (cb) {
						cb($rootScope.token);
						console.log('Token Received');
						// console.log($rootScope.token);
					}
				}).error(function(data) {
					console.log(data);
				});
			}
		};
	} ]);
});