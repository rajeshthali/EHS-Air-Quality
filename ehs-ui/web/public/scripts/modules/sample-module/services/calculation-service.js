define([ 'angular', './services-module'], function(angular, module) {
	'use strict';
	module.service('CalculationService', [ '$q', '$http', function($q, $http) {
		/*
		 * this.myFunc = function (x) { return x.toString(16); };
		 */

		var AirqualityDataService = {};
		// Gets the list of nuclear weapons
		this.getNukes = function() {
			return $http.get('/sample-data/EHS_Machine_JSON.json').then(function(data) {
				return data;
			});
		};
	} ]);
});
