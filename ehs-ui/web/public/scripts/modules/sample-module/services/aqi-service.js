define([ 'angular', './services-module'], function(angular, sampleModule) {
	'use strict';
	sampleModule.factory('AqiService',['$http', '$rootScope', function($http, $rootScope) {
		return {
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
			},
			lastWeekHighestAQI : function(name) {
				return $http({
					method : 'GET',
					url : 'https://ehs-rmd-datasource2.run.aws-usw02-pr.ice.predix.io/services/geography/lastWeekHighestAQI?asset_name=' + name,
					headers : {
						'Authorization' : $rootScope.token
					}
				});
			},
			last24Hrs : function(name) {
				return $http({
					method : 'GET',
					url : 'https://ehs-rmd-datasource2.run.aws-usw02-pr.ice.predix.io/services/geography/last24Hrs?asset_name=' + name,
					headers : {
						'Authorization' : $rootScope.token
					}
				});
			},
			last1Hrs : function(name) {
				return $http({
					method : 'GET',
					url : 'https://ehs-rmd-datasource2.run.aws-usw02-pr.ice.predix.io/services/geography/last1Hrs?asset_name=' + name,
					headers : {
						'Authorization' : $rootScope.token
					}
				});
			},
			last20Sec : function(name) {
				return $http({
					method : 'GET',
					url : 'https://ehs-rmd-datasource2.run.aws-usw02-pr.ice.predix.io/services/geography/last20Sec?asset_name=' + name,
					headers : {
						'Authorization' : $rootScope.token
					}
				});
			},
			last10Min : function(name) {
				return $http({
					method : 'GET',
					url : 'https://ehs-rmd-datasource2.run.aws-usw02-pr.ice.predix.io/services/geography/last10Min?asset_name=' + name,
					headers : {
						'Authorization' : $rootScope.token
					}
				});
			},
			last10MinDataPoints : function(name, success, error) {
				var localThis = this;
				this.last10Min(name).then(function(data) {
					success(localThis.prettyMs(data.data.body.timestamps), data.data.body);
				}, function(e) {
					error(e);
				});
			},
			last1HrsDataPoints : function(name, success, error) {
				var localThis = this;
				this.last1Hrs(name).then(function(data) {
					success(localThis.prettyMs(data.data.body.timestamps), data.data.body);
				}, function(e) {
					error(e);
				});
			},
			last20SecDataPoints : function(name, success, error) {
				var localThis = this;
				this.last20Sec(name).then(function(data) {
					success(localThis.prettyMs(data.data.body.timestamps), data.data.body);
				}, function(e) {
					error(e);
				});
			},
			lastWeekHighestAqiDataPoint : function(name, success, error) {
				var localThis = this;
				this.lastWeekHighestAQI(name).then(function(data) {
					success(data.data.body);
				}, function(e) {
					error(e);
				});
			}
		};
	}]);

});
