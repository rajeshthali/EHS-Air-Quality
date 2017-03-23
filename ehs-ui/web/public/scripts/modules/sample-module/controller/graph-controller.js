define(['angular', './controllers-module'], function (angular, controllers) {
    'use strict';

  
    // Controller definition
    controllers.controller('GraphCtrl', ['$scope','$http', '$log', 'PredixAssetService', 'PredixViewService', function ($scope,$http,$log, PredixAssetService, PredixViewService) {
    
    		$scope.data_chart = [
    		                     {'x': 1397102460000, 'y': 11.4403},
    		                     {'x': 1397139660000, 'y': 13.1913},
    		                     {'x': 1397177400000, 'y': 12.8485},
    		                     {'x': 1397228040000, 'y': 10.975},
    		                     {'x': 1397248260000, 'y': 12.9377},
    		                     {'x': 1397291280000, 'y': 13.3795},
    		                     {'x': 1397318100000, 'y': 13.0869},
    		                     {'x': 1397342100000, 'y': 17.3758}
    		                   ];
    		$scope.data_chart_1     =      [
    		                     {'x': 1397142560000, 'y': 12.4403},
    		                     {'x': 1397159560000, 'y': 14.1913},
    		                     {'x': 1397157500000, 'y': 15.8485},
    		                     {'x': 1397258040000, 'y': 12.975},
    		                     {'x': 1397258260000, 'y': 13.9377},
    		                     {'x': 1397251280000, 'y': 14.3795},
    		                     {'x': 1397358100000, 'y': 14.0869},
    		                     {'x': 1397352100000, 'y': 15.3758}
    		                   ];
    		//series chart obj methode
    		/*document.querySelector('#my-series').seriesObj = {
    	        myData: [
    	            [1397102460000, 11.4403],
    	            [1397139660000, 13.1913],
    	            [1397177400000, 12.8485],
    	            [1397228040000, 10.975]],
    	        myName: 'foo',
        	
    	    };
    		document.querySelector('#my-series-1').seriesObj = {
    		  myData_1: [
    	       	            [1397132460000, 10.4403],
    	       	            [1397159660000, 11.1913],
    	       	            [1397187400000, 14.8485],
    	       	            [1397258040000, 11.975]],
    	       	        myName_1: 'foob'
    		
    		 };*/
    		
    		
    }]);
    });