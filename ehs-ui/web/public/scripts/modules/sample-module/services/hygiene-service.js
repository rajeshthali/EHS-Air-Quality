define([ 'angular', './services-module'], function(angular, sampleModule) {
	'use strict';
	sampleModule.factory('HygieneService',['$http','$rootScope', function($http, $rootScope) {
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
			last1Hrs : function(name) {
				return $http({
					method : 'GET',
					url : 'https://ehs-rmd-datasource2.run.aws-usw02-pr.ice.predix.io/services/hygiene/last1Hrs',
					headers : {
						'Authorization' : $rootScope.token
					}
				});
			},
			last20Sec : function(name) {
				return $http({
					method : 'GET',
					url : 'https://ehs-rmd-datasource2.run.aws-usw02-pr.ice.predix.io/services/hygiene/last20Sec',
					headers : {
						'Authorization' : $rootScope.token
					}
				});
			},
			last10Min : function(name) {
				return $http({
					method : 'GET',
					url : 'https://ehs-rmd-datasource2.run.aws-usw02-pr.ice.predix.io/services/hygiene/last10Min',
					headers : {
						'Authorization' : $rootScope.token
					}
				});
			},
			last20SecDataPoints : function(success, error) {
				var localThis = this;
				this.last20Sec(name).then(function(data) {
					success(data);
				}, function(e) {
					error(e);
				});
			},
			dashboardValues : function() {
				return $http({
					method : 'GET',
					url : 'https://ehs-rmd-datasource2.run.aws-usw02-pr.ice.predix.io/services/hygiene/dashboardValues',
					headers : {
						'Authorization' : $rootScope.token
					}
				});
			},
			dashboardValues2 : function() {
				return $http({
					method : 'GET',
					url : 'https://ehs-rmd-datasource2.run.aws-usw02-pr.ice.predix.io/services/hygiene/dashboardValues',
					headers : {
						'Authorization' : $rootScope.token
					}
				});
			},
			last1HrsDataPoints : function(success, error) {
				var localThis = this;
				this.last1Hrs().then(function(data) {
					success(data);
				}, function(e) {
					error(e);
				});
			},
			last20SecDataPoints : function(success, error) {
				var localThis = this;
				this.last20Sec(name).then(function(data) {
					success(data);
				}, function(e) {
					error(e);
				});
			}
		};
	}]);

});
