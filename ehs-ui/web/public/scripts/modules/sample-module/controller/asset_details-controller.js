define(['angular', './controllers-module',], function (angular, controllers) {
    'use strict';

  
    // Controller definition
    controllers.controller('AssetDetailCtrl', ['$scope','$http', '$log', 'PredixAssetService', 'PredixViewService', function ($scope,$http,$log, PredixAssetService, PredixViewService) {
    
    	  $scope.acc_token='';
    		console.log("i am in asset control");
    		
    		/*$scope.url = 'https://d94a067a-c0d5-4d02-b2a6-3baedc95a7b2.predix-uaa.run.aws-usw02-pr.ice.predix.io';
    		$scope.client_id = 'client_ass_khu';
    		$scope.secret ='client';
    		const uaa_util = require('predix-uaa-client');
    		
    		uaa_util.getToken(url,client_id,secret).then((token) => {
    		    // Use token.access_token as a Bearer token Authroization header 
    		    // in calls to secured services. 
    		    request.get({
    		        uri: 'https://d94a067a-c0d5-4d02-b2a6-3baedc95a7b2.predix-uaa.run.aws-usw02-pr.ice.predix.io',
    		        headers: {
    		            Authorization: 'Bearer ' + token.access_token
    		        }
    		    }).then((data) => {
    		        console.log('Got ' + data + ' from service');
    		    }).catch((err) => {
    		        console.error('Error getting data', err);
    		    });
    		}).catch((err) => {
    		    console.error('Error getting token', err);
    		});*/
    		
    		
    		
    		
    		var httpRequest = $http({
    			headers: {
    				
    		        "Authorization": 'Basic Y2xpZW50X2Fzc19raHU6Y2xpZW50',
					"Content-Type":'application/json',
					
    		    },
    		   
    		    params:{grant_type: 'client_credentials'},
    		    method: 'POST',
    		    url: 'https://d94a067a-c0d5-4d02-b2a6-3baedc95a7b2.predix-uaa.run.aws-usw02-pr.ice.predix.io/oauth/token',
    		}).success(function(data){
    		  //$scope.token = data;  
    		  //console.log("token--------" + data.access_token);
    		  $scope.acc_token = data.access_token;
    		  //console.log("JSON*********"+JSON.stringify($scope.acc_token));
    		  httpRequest($scope.acc_token);

    		});
    		
    		

    		var httpRequest = function(acc_token){
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
    		  console.log("JSON*********"+JSON.stringify($scope.contlist));

    		});
    		}
    		
    		
    }]);
    });