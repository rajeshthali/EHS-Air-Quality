define(['angular', './services-module'], function(angular, module) {
    'use strict';
    module.service('SensorDataService', ['$q', '$http','Config', function($q, $http, Config) {
	    return {
	    	  loadSensorData : function(token,interval, cb) {
	          return $http({
						//method : 'GET',
						//url : 'scripts/modules/sample-module/services/REAL_Sensor_Data.json',
		        	    method : 'GET',
						url : Config.baseUrl + '/api/sensorData/' + 0 + '?interval=' + interval,
						headers : {
							'Authorization' : token
						}
				}).success(function(response) {
						}).success(function(response) {
						if (cb)
							cb(response);
					});
               }	    
	       };
	}]);
});



