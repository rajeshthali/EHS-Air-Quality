define([ 'angular', './controllers-module'], function(angular, controllers) {
	'use strict';
	controllers.controller('SensorDataController', [ '$scope', '$http', '$state', '$log', '$interval','$rootScope', 'AuthService',  'SensorDataService',
			function($scope, $http, $state, $log, $interval, $rootScope, AuthService, SensorDataService) {
		$scope.isLoading = true;
		var intervalPromiseSensor = null;
		var sensorCharts = [];
		$scope.sensorTabList=['Sensor Data','Alerts'];
		$scope.sensorTabEnableList=[true,false];
		$scope.sensorAlert =[];
		$scope.sensorAlertTimeStamp =[];
		var startDynamiUpdate = function() {
			intervalPromiseSensor = $interval(function() {
				realSensorData(20*20000);
			}, 10000);
		};
		$scope.$on('$destroy', function() {
			$scope.stop();
		});

		$scope.stop = function() {
			$interval.cancel(intervalPromiseSensor);
		};
		
		$scope.displaySensorTab= function(index) {
			for(var i=0;i<2;i++){
				$scope.sensorTabEnableList[i] = false;
			}
			$scope.sensorTabEnableList[index] = true;
		};
		
		   
		var loadData = function() {
			AuthService.getTocken(function(token) {
				realSensorData(20*20000);
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
					   //'PM2_5','Temperature'
					  
					   var dataXaxis =[];
					   var dataYaxis =[];
					   if($scope.sensorAlert.length >= 22){
						   for(var j=0;j<5;j++) {
							   $scope.sensorAlert.splice(j, 1);
							   $scope.sensorAlertTimeStamp.splice(j, 1);
							   
						   }
						   
					   }
					   for (var j = 0; j < sensorDataValues.length; j++) {
						   dataXaxis.push(sensorDataValues[j].timeStamp);
						   dataYaxis.push(sensorDataValues[j].sensorValue);
						   if("PM2_5" === sensorName && sensorDataValues[j].sensorValue > 1010) {
							   if($scope.sensorAlertTimeStamp.indexOf(sensorDataValues[j].timeStamp) === -1) {
								   $scope.sensorAlert.push("PM2_5 is "+sensorDataValues[j].sensorValue + " at "+ convertTimeStamp(sensorDataValues[j].timeStamp));
								   $scope.sensorAlertTimeStamp.push(sensorDataValues[j].timeStamp);
							   }
						   }else if("Temperature" === sensorName && sensorDataValues[j].sensorValue > 22) {
							   if($scope.sensorAlertTimeStamp.indexOf(sensorDataValues[j].timeStamp) === -1) {
								   $scope.sensorAlert.push("Temperature is "+sensorDataValues[j].sensorValue + " at "+ convertTimeStamp(sensorDataValues[j].timeStamp));
								   $scope.sensorAlertTimeStamp.push(sensorDataValues[j].timeStamp);
							   }
							}
					   }
					   loadValuesToGraph('Container_'+sensorName,convertTimeStamps(dataXaxis),dataYaxis,sensorName);
					   }
			   });
				   
			   
			
       	 }
			var convertTimeStamps =  function(timestamps) {
				var dates = [];
				for (var i = 0; i < timestamps.length; i++) {
					dates.push(convertTimeStamp(timestamps[i]));
				}
				return dates;
			};

			var convertTimeStamp = function(timestamp) {
				var date = new Date(timestamp);
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
				return dateString; 
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