define([ 'angular', './controllers-module'], function(angular, controllers) {
	'use strict';
	controllers.controller('SensorDataController', [ '$scope', '$http', '$state', '$log', '$interval','$rootScope', 'AuthService',  'SensorDataService',
			function($scope, $http, $state, $log, $interval, $rootScope, AuthService, SensorDataService) {
		$scope.isLoading = true;
		var intervalPromiseSensor = null;
		var sensorCharts = [];
		//"Temperature:MY-APPENDER-VINAYAK","PB:MY-APPENDER-VINAYAK","O3:MY-APPENDER-VINAYAK","CO2:MY-APPENDER-VINAYAK","PM2_5:MY-APPENDER-VINAYAK","NH3:MY-APPENDER-VINAYAK","PM10:MY-APPENDER-VINAYAK","SO2:MY-APPENDER-VINAYAK"
		$scope.sensorTabList=['PM2_5','Temperature','PB','O3','CO2','NH3','PM10','SO2'];
		$scope.sensorTabEnableList=[true,false,false,false,false,false,false,false];
		$scope.tabIndex = 0;
		var startDynamiUpdate = function() {
			intervalPromiseSensor = $interval(function() {
				realSensorData(7*20000);
			}, 10000);
		};
		$scope.$on('$destroy', function() {
			$scope.stop();
		});

		$scope.stop = function() {
			$interval.cancel(intervalPromiseSensor);
		};
		
		$scope.selectTab = function(index) {
			$scope.tabIndex = index;
			$('.sensor_details_graph_class').hide();
		    console.log("select tab index is: " +$scope.tabIndex)
		    setTimeout(function() {
					$('.sensor_details_graph_class').fadeIn();
			     	loadGraph($scope.sensorDataList,index);
		    }, 300);
	     };
		
		$scope.displaySensorTab= function(index) {
			for(var i=0;i<8;i++){
				$scope.sensorTabEnableList[i] = false;
			}
			$scope.sensorTabEnableList[index] = true;
		};
		
		var loadData = function() {
			AuthService.getTocken(function(token) {
				realSensorData(7*20000);
				startDynamiUpdate();
				
			});
		};
		loadData();
		 
		var realSensorData = function(interval) {
			SensorDataService.loadSensorData($rootScope.token,interval, function(res){
				$scope.isLoading = false;
				$scope.sensorDataList= angular.copy(res);
				$('.sensor_details_graph_class').hide();
			    console.log("select tab index is: " +$scope.tabIndex)
			    setTimeout(function() {
						$('.sensor_details_graph_class').fadeIn();
				     	loadGraph($scope.sensorDataList,0);
			    }, 300);
				});
			};
			
			var loadGraph = function(sensorDataList,index) {
				 for (var i = 0; i < sensorDataList.length; i++) {
					   var sensorName = sensorDataList[i].name;
					   var sensorDataValues = sensorDataList[i].sensorDataValues;
					   //'PM2_5','Temperature'
					   var dataXaxis =[];
					   var dataYaxis =[];
					   for (var j = 0; j < sensorDataValues.length; j++) {
						   dataXaxis.push(sensorDataValues[j].timeStamp);
						   dataYaxis.push(sensorDataValues[j].sensorValue);
					   }
					   for (var index = 0; index < $scope.sensorTabList.length;index++) {
						   if($scope.sensorTabList[index] == sensorName) {
							   loadValuesToGraph('container_'+index,convertTimeStamps(dataXaxis),dataYaxis,sensorName);
							   break;
						   }
					   }
					   
				   }
			};
		
			
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
			var getTresholdLimits = function(sensorName) {
				var tresholdLimits =[];
				if("Temperature" === sensorName) {
					tresholdLimits.push(22.25); 
					tresholdLimits.push(20.75);
				}else if("PM2_5" === sensorName){
					tresholdLimits.push(160);
					tresholdLimits.push(120);
				}
				return tresholdLimits;
			};
			
			var getYAxisType = function(sensorName) {
				var returnValue;
				if("Temperature" === sensorName) {
					returnValue = "Deg C";
				}else if("PM2_5" === sensorName){
					returnValue = "PPM";
				}else{
					returnValue = "Sensor Values";
				}
				return returnValue;
			};
			
			var loadValuesToGraph = function(id, dataX, dataY, sensorName) {
				 var tresholdLimits = getTresholdLimits(sensorName);
				 var yAxisType = getYAxisType(sensorName);
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
								text : '<b>'+'Time' + '</b>'
							},
							categories :dataX
							},

						yAxis : {
							title : {
								text : '<b>'+ yAxisType + '</b>'
							},
							
							plotLines: [{
							    color: 'red', // Color value
							    dashStyle: 'solid', // Style of the plot line. Default to solid
							    value: tresholdLimits[0], // Value of where the line will appear
							    width: 2 // Width of the line    
							  },{
								    color: 'red', // Color value
								    dashStyle: 'solid', // Style of the plot line. Default to solid
								    value: tresholdLimits[1], // Value of where the line will appear
								    width: 2 // Width of the line    
								  }],
							  
							  

						},

						series : [{
				        	name: sensorName,
				            data: dataY,
				            type: 'spline',
				            color: 'Blue'
				           

				        }
				        ]

					});
				

				});
		
			
			};
		 
	    	}]);

});