define(['angular','./services-module'], function(angular, sampleModule) {
    'use strict';

 // service
    sampleModule.service('Onloadaqi',  ['$rootScope','$q','$http','$cacheFactory','superCache', function($rootScope,$q,$http,$cacheFactory,superCache) {
    	this.urldata = function(){
    		 var deferred = $q.defer();
    		return $http({
				method : 'GET',
				cache: true ,
				url : 'https://3ac499f6-d00a-4f3f-a15f-eec715933a48.predix-uaa.run.aws-usw02-pr.ice.predix.io/oauth/token?grant_type=client_credentials' ,
				headers : {
					'Authorization' : 'Basic ZWhzLWNsaWVudC1pZDpjbGllbnQ='
				}
			}).success(function(data) {
				return data;

			});
    	
    	};
    	
    	
    	
    	
    }]);
});