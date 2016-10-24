define(['angular', './services-module'], function (angular, controllers) {
    'use strict';


   //angular.module('superCache')
   controllers.factory('superCache', ['$cacheFactory', function($cacheFactory) {
      return $cacheFactory('super-cache');
    }]);
/*controllers.factory('myCache', function($cacheFactory) {
		// return $cacheFactory('myData');



	var factory = function() { };

    factory.cache = " ";
    var cache ="";

    factory.prototype.create = function(cacheId){  
        cache = $cacheFactory(cacheId); 
        return cache;
    };

    factory.prototype.add = function(key,value){
        if (!cache)
            return;
        cache.put(key, value);
    }

    factory.prototype.get = function(key){
        if (!cache)
            return;
        return cache.get(key);
    }

    return factory;




		});*/


}); 