define(['angular', './services-module'], function(angular, module) {
    'use strict';
    module.service('SensorDataService', ['$q', '$http', function($q, $http) {
	    return {
	    	  loadSensorData : function(cb) {
	          return $http({
						method : 'GET',
						url : 'scripts/modules/sample-module/services/REAL_Sensor_Data.json',
						/*headers : {
							'Authorization' : $rootScope.token
						}*/
						}).success(function(response) {
						if (cb)
							cb(response);
						    //console.log("sensor data" +JSON.stringify(response));
					});
               },
	         		prettyMs : function(timestamps) {
						var dates = [];
						for (var i = 0; i < timestamps.length; i++) {
							var date = new Date(timestamps[i]);
							var h = 0;
							var m = 0;
							var s = 0;
							if (date.getHours() < 10)
								h = '0' + date.getHours();
							else
								h = date.getHours();
							if (date.getMinutes() < 10)
								m = '0' + date.getMinutes();
							else
								m = date.getMinutes();
							if (date.getSeconds() < 10)
								s = '0' + date.getSeconds();
							else
								s = date.getSeconds();
			
							var dateString = h + ':' + m + ':' + s;
							dates.push(dateString);
						}
						return dates;
		        }
	    
	       };
	}]);
});



