define(['angular', './controllers-module',], function (angular, controllers) {
    'use strict';

  
    // Controller definition
    controllers.controller('AssetDetailCtrl', ['$scope','$http', '$log', 'PredixAssetService', 'PredixViewService', function ($scope,$http,$log, PredixAssetService, PredixViewService) {
    
    	  $scope.acc_token='';    		
    		
    		var httpRequest = $http({
    			headers: {
    				
    		        "Authorization": 'Basic Y2xpZW50X2Fzc19raHU6Y2xpZW50',
					"Content-Type":'application/json',
					
    		    },
    		   
    		    params:{grant_type: 'client_credentials'},
    		    method: 'POST',
    		    url: 'https://d94a067a-c0d5-4d02-b2a6-3baedc95a7b2.predix-uaa.run.aws-usw02-pr.ice.predix.io/oauth/token',
    		}).success(function(data){
    		  $scope.acc_token = data.access_token;
    		  httpRequest($scope.acc_token);

    		});
    		
    		

    		 httpRequest = function(acc_token){
    			$http({
    			headers: {
    		        "Authorization": 'bearer '+ acc_token,
					"Content-Type":'application/json',
					"predix-zone-id":"d03b16c6-9af3-4d96-ace3-2251c854646a"
    		    },
    		    method: 'GET',
    		    url: 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/locomotives/',
    		}).success(function(data){
    		  $scope.contlist = data;        
    		 
    		});
    		}
    		
    		
    }]);
    });