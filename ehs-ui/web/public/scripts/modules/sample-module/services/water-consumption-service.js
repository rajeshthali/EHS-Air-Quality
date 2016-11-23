define([ 'angular', './services-module' ], function(angular, sampleModule) {
	'use strict';
	sampleModule.factory('WaterConsumptionService', [ '$http', '$rootScope', 'AuthService', 'Config', function($http, $rootScope, AuthService, Config) {
		return {
			getWaterConsumptionValues : function(floor, interval, cb) {
				var thisObject = this;
				if (!$rootScope.token) {
					AuthService.getTocken(function(token) {
						thisObject.getWaterConsumption($rootScope.token, floor, interval, cb);
					});
				} else {
					thisObject.getWaterConsumption($rootScope.token, floor, interval, cb);
				}
			},
			getWaterConsumption : function(token, floor, interval, cb) {
				$http({
					method : 'GET',
					url : Config.baseUrl + '/api/water/' +floor + '?interval=' + interval,
					headers : {
						'Authorization' : token
					}
				}).success(function(response) {
					if (cb)
						cb(response);
				});
			},
			getWaterAreaValues : function(floor, interval, cb) {
				var thisObject = this;
				if (!$rootScope.token) {
					AuthService.getTocken(function(token) {
						thisObject.getWaterArea($rootScope.token, floor, interval, cb);
					});
				} else {
					thisObject.getWaterArea($rootScope.token, floor, interval, cb);
				}
			},
			getWaterArea : function(token, floor, interval, cb) {
				$http({
					method : 'GET',
					url : Config.baseUrl + '/api/water/' + floor + '?interval=' + interval,
					headers : {
						'Authorization' : token
					}
				}).success(function(response) {
					if (cb)
						cb(response);
				});
			},
			getWaterAreaLastWeek : function(floor, interval, cb) {
				var currentMs = (new Date()).getTime();
				var twoDays = 1000 * 60 * 60 * 24 * 2;

				var startTime = currentMs - twoDays - interval;
				var endTime = currentMs - twoDays;

				var thisObject = this;

				if (!$rootScope.token) {
					AuthService.getTocken(function(token) {
						thisObject.getWaterAreaWithStartTimeEndTime(token, floor, startTime, endTime, cb);
					});
				} else {
					thisObject.getWaterAreaWithStartTimeEndTime($rootScope.token, floor, startTime, endTime, cb);
				}
			},
			getWaterAreaWithStartTimeEndTime : function(token, floor, startTime, endTime, cb) {
				$http({
					method : 'GET',
					url : Config.baseUrl + '/api/aqi/areaWithStartTimeEndTime/' + floor + '?startTime=' + startTime + '&endTime=' + endTime,
					headers : {
						'Authorization' : token
					}
				}).success(function(response) {
					if (cb)
						cb(response);
				});
			},
			getWaterValues : function(floor, interval, cb) {
				var thisObject = this;
				if (!$rootScope.token) {
					AuthService.getTocken(function(token) {
						thisObject.getWater($rootScope.token, floor, interval, cb);
					});
				} else {
					thisObject.getWater($rootScope.token, floor, interval, cb);
				}
			},
			getWater : function(token, floor, interval, cb) {
				$http({
					method : 'GET',
					url : Config.baseUrl + '/api/water/' + floor + '?interval=' + interval,
					headers : {
						'Authorization' : token
					}
				}).success(function(response) {
					if (cb)
						cb(response);
				});
			},
			prettyMs : function(timestamp) {
				var dates = [];
				for (var i = 0; i < timestamp.length; i++) {
					var date = new Date(timestamp[i]);
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
			}	};
	} ]);
});