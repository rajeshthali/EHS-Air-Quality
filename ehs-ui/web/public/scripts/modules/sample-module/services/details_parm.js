define(['angular', './services-module'], function (angular, controllers) {
    'use strict';

  
    // Controller definition
    controllers.controller('detilparaCtrl', ['$scope','$http', '$log', 'PredixAssetService', 'PredixViewService', function ($scope,$http,$log, PredixAssetService, PredixViewService) {
    		console.log("i am in detil para control");
    	}]);
    });