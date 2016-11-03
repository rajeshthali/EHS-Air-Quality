define([ 'angular', './controllers-module'], function(angular, controllers) {
	'use strict';
	controllers.controller('SensorDataController', [ '$scope', '$http', '$state', '$log', '$interval','$rootScope', 'AuthService',  'SensorDataService',
			function($scope, $http, $state, $log, $interval, $rootScope, AuthService, SensorDataService) {
		$scope.isLoading = true;
		var intervalPromiseSensor = null;
		var sensorCharts = [];
		var startDynamiUpdate = function() {
			intervalPromiseSensor = $interval(function() {
				realSensorData(60000);
			}, 10000);
		};
		$scope.$on('$destroy', function() {
			$scope.stop();
		});

		$scope.stop = function() {
			$interval.cancel(intervalPromiseSensor);
		};
		
		
		var loadData = function() {
			AuthService.getTocken(function(token) {
				realSensorData(120000);
				startDynamiUpdate();
				
			});
		};
		loadData();
		 
		var realSensorData = function(interval) {
			
			SensorDataService.loadSensorData($rootScope.token,interval, function(res){
				$scope.isLoading = false;
				   var sensorDataList= angular.copy(res);
				   for (var i = 0; i < sensorDataList.length; i++) {
					   var sensorName = sensorDataList[i].name;
					   var sensorDataValues = sensorDataList[i].sensorDataValues;
					   var dataXaxis =[];
					   var dataYaxis =[];
					   for (var j = 0; j < sensorDataValues.length; j++) {
						   dataXaxis.push(sensorDataValues[j].timeStamp);
						   dataYaxis.push(sensorDataValues[j].sensorValue);
					   }
					   loadValuesToGraph('Container_'+sensorName,convertTimeStamps(dataXaxis),dataYaxis,sensorName);
					   }
			   });
				   
			   
			
       	 }
			var convertTimeStamps =  function(timestamps) {
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
			};

			
			
			var loadValuesToGraph = function(id, dataX, dataY, sensorName) {
				 console.log(id + ' >> ');
				 console.log(dataX + ' >dataX> ' );
				 console.log(dataY + ' >dataY> ' );
				 console.log(sensorName + ' >sensorName> ' );
				 $('#'+id).each(function() {
					// console.log('each');
					var chart = new Highcharts.Chart({
						//type : 'spline',
						animation : Highcharts.svg,
						marginRight : 10,
						chart : {
							renderTo : id
						},
						title : {
							text : ''
						},
						tooltip : {
							formatter : function() {
								return '<b>' + sensorName + '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + Highcharts.numberFormat(this.y, 2);
							}
						},
						exporting : {
							enabled : false
						},

						plotOptions : {
							series : {
								lineWidth : 1,
								marker : {
									enabled : false,
								},
							}
						},
						credits : {
							enabled : false
						},

						xAxis : {
							title : {
								text : 'Time'
							},
							categories :dataX
						},

						yAxis : {
							title : {
								text : 'Sensor Values'
							},
						},

						series : [{
				        	name: sensorName,
				            data: dataY,
				            type: 'spline',
				            color: 'Black'
				           

				        }
				        ]

					});
				

				});
		
			
			};
		 
	    	}]);

});