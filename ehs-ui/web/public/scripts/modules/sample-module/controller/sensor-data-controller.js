define([ 'angular', './controllers-module'], function(angular, controllers) {
	'use strict';
	controllers.controller('SensorDataController', [ '$scope', '$http', '$state', '$log', '$interval','$rootScope', 'AuthService',  'SensorDataService',
			function($scope, $http, $state, $log, $interval, $rootScope, AuthService, SensorDataService) {
		var intervalPromiseSensor = null;
		var sensorCharts = [];
		//"Temperature:MY-APPENDER-VINAYAK","PB:MY-APPENDER-VINAYAK","O3:MY-APPENDER-VINAYAK","CO2:MY-APPENDER-VINAYAK","PM2_5:MY-APPENDER-VINAYAK","NH3:MY-APPENDER-VINAYAK","PM10:MY-APPENDER-VINAYAK","SO2:MY-APPENDER-VINAYAK"
		$scope.sensorTabListForUI=['Methanol','CO2','Temperature','PB','O3','NH3','PM10','SO2'];
		$scope.sensorTabListForService=['PM2_5','CO2','Temperature','PB','O3','NH3','PM10','SO2'];
		$scope.sensorTabEnableList=[true,false,false,false,false,false,false,false];
		$scope.tabIndex = 0;
		var startDynamiUpdate = function() {
			intervalPromiseSensor = $interval(function() {
				realSensorDataReload(7*20000);
			}, 12000);
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
		    realSensorData(7*20000);
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
			$scope.isLoading = true;
			SensorDataService.loadSensorData($rootScope.token,interval, function(res){
				$scope.isLoading = false;
				$scope.sensorDataList= angular.copy(res);
				$('.sensor_details_graph_class').hide();
			    console.log("select tab index is: " +$scope.tabIndex)
			    setTimeout(function() {
						$('.sensor_details_graph_class').fadeIn();
				     	loadGraph($scope.sensorDataList);
			    }, 300);
				});
			};
			
			var realSensorDataReload = function(interval) {
				//$scope.isLoading = true;
				SensorDataService.loadSensorData($rootScope.token,interval, function(res){
					///$scope.isLoading = false;
					$scope.sensorDataList= angular.copy(res);
					for (var i = 0; i < $scope.sensorDataList.length; i++) {
						   var sensorName = $scope.sensorDataList[i].name;
						   if(sensorName ===  $scope.sensorTabListForService[$scope.tabIndex]) {
							   var sensorDataValues = $scope.sensorDataList[i].sensorDataValues;
							   var lastServiceTimeStamp = convertTimeStamp(sensorDataValues[sensorDataValues.length-1].timeStamp);
							   var lastServicevalue = sensorDataValues[sensorDataValues.length-1].sensorValue;
							   var length = sensorCharts[$scope.tabIndex].series[0].data.length;
							   if (length > 0) {
								   var lastChartTimeStamp = sensorCharts[$scope.tabIndex].series[0].data[length - 1]['category'];
								   if(lastServiceTimeStamp !== lastChartTimeStamp) {
									   sensorCharts[$scope.tabIndex].series[0].addPoint([lastServiceTimeStamp, lastServicevalue], true, true); 
								   }
							   }
					 	   }
			     		 }
					});
				};
			
			var loadGraph = function(sensorDataList) {
				 for (var i = 0; i < sensorDataList.length; i++) {
					  
					   var sensorName = sensorDataList[i].name;
					   for (var index = 0; index < $scope.sensorTabListForService.length;index++) {
						   if($scope.sensorTabListForService[index] == sensorName) {
							   var sensorDataValues = sensorDataList[i].sensorDataValues;
							   //'PM2_5','Temperature'
							   var dataXaxisTemp =[];
							   var dataYaxis =[];
							   for (var j = 0; j < sensorDataValues.length; j++) {
								   dataXaxisTemp.push(sensorDataValues[j].timeStamp);
								   dataYaxis.push(sensorDataValues[j].sensorValue);
							   }
							   $scope.dataXaxis = convertTimeStamps(dataXaxisTemp);
							   loadValuesToGraph('containerS_'+index,$scope.dataXaxis,dataYaxis,sensorName, index);
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
				}else if("Methanol" === sensorName){
					tresholdLimits.push(400);
					tresholdLimits.push(120);
				}else if("CO2" === sensorName){
					tresholdLimits.push(12000);
					tresholdLimits.push(8000);
				}
				
				return tresholdLimits;
			};
			
			var getYAxisType = function(sensorName) {
				var returnValue;
				if("Temperature" === sensorName) {
					returnValue = "Deg C";
				}else if("Methanol" === sensorName){
					returnValue = "PPM";
				}else if("CO2" === sensorName){
					returnValue = "PPM";
				}else{
					returnValue = "Sensor Values";
				}
				return returnValue;
			};
			
			var loadValuesToGraph = function(id, dataX, dataY, sensorName, index) {
				 var sensorNameForUI =  sensorName === "PM2_5" ? "Methanol" : sensorName;
				 var tresholdLimits = getTresholdLimits(sensorNameForUI);
				 var yAxisType = getYAxisType(sensorNameForUI);
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
								return '<b>' + sensorNameForUI + '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + Highcharts.numberFormat(this.y, 2);
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
				        	name: sensorNameForUI,
				            data: dataY,
				            type: 'spline',
				            color: 'Blue'
				           

				        }
				        ]

					});
					sensorCharts[index] = chart;
					
				});
				 
			
			};
		 
	    	}]);

});