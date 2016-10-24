define([ 'angular', './services-module' ], function(angular, sampleModule) {
	'use strict';
	sampleModule.factory('NewhygnService', [ '$http', '$rootScope', 'AuthService', 'Config', function($http, $rootScope, AuthService, Config) {
		return {
			
			getHygieneValues : function(floor, interval, cb) {
				var thisObject = this;
				if (!$rootScope.token) {
					AuthService.getTocken(function(token) {
						thisObject.getHygiene($rootScope.token, floor, interval, cb);
					});
				} else {
					thisObject.getHygiene($rootScope.token, floor, interval, cb);
				}
			},
			getHygiene : function(token, floor, interval, cb) {
				$http({
					method : 'GET',
					url : Config.baseUrl + '/api/hygiene/' + floor + '?interval=' + interval,
					headers : {
						'Authorization' : token
					}
				}).success(function(response) {
					if (cb)
						cb(response);
				});
			}
			
			
		};
	} ]);
});