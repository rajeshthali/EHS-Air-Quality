define([ 'angular', './services-module'], function(angular, sampleModule) {
	'use strict';
	sampleModule.factory('HygieneService',['$http','$rootScope', function($http, $rootScope) {
		return {};
	}]);

});
