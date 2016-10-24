define(['angular', './services-module'], function(angular, module) {
    'use strict';
    module.service('AirqualityDataService', ['$q', '$http', function($q, $http) {
	   /* this.myFunc = function (x) {
	        return x.toString(16);
	    };*/
	    
	    
	  

	    //Gets the list of nuclear weapons
	    this.getNukes = function() {
	    	
	        $http.get('/sample-data/EHS_Machine_JSON.json')
	            .success(function(data) {
	            	
	                //nukeService.data.nukes = data;
	                //console.log("im in success" + JSON.stringify(nukeService.data.nukes));
	            	 console.log("im in success" + JSON.stringify(data));
	            	 mydata(data);
	            	//return data;
	               
	            });
	       
	       
	    };
	    var mydata = function(data){
	   	 console.log("im in mydara" + JSON.stringify(data));
	   	return data;
	   };

	      
    }]);
});



