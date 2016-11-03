define([ 'angular', './controllers-module'], function(angular, controllers) {
	'use strict';
	controllers.controller('SensorDataController', [ '$scope', '$http', '$state', '$log', '$interval','$rootScope', 'AuthService',  'SensorDataService',
			function($scope, $http, $state, $log, $interval, $rootScope, AuthService, SensorDataService) {
		
		var intervalPromiseSensor = null;
		var sensorCharts = [];
		var startDynamiUpdate = function() {
			intervalPromiseSensor = $interval(function() {
				realSensorData();
			}, 40000);
		};
		$scope.$on('$destroy', function() {
			$scope.stop();
		});

		$scope.stop = function() {
			$interval.cancel(intervalPromiseSensor);
		};
		
		
		var loadData = function() {
			AuthService.getTocken(function(token) {
				realSensorData();
				
			});
		};
		loadData();
		 
		var realSensorData = function() {
			SensorDataService.loadSensorData($rootScope.token,40000, function(res){
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
					   
					   setTimeout(function() {
							$('.aqi_details_graph_class').fadeIn();
							loadValuesToGraph('Container_'+sensorName,convertTimeStamps(dataXaxis),dataYaxis,sensorName);
						}, 300);
				
					   
				   }
				 
				   //  var series = getSeries($scope.data);
			   });
				   
			   
			
       	 }
		   var getMaxIndex = function(data) {
				var big = 0;
				var index = 0;
				for (var i = 0; i < data.timestamp.length; i++) {
					if (big < data.timestamp[i]) {
						big = data.timestamp[i];
						index = i;
					}
				}
				return index;
			};
			
			
			var getSeries = function(dataArg) {
				var colors = [ '#8769FF', '#27A9E3', '#28B779', '#ff9000', '#8bd6f6', '#8669ff', '#28b779' ];
				var series = [];
				var data = null;
				if (dataArg) {
					data = dataArg;
				} else {
					data = $scope.hygieneData[tabId];
				}
				series.push({
					name : 'Temperature',
					data : data.temperature,
					color : colors[1],
					lineWidth : 1,
					marker : {
						enabled : false,
					}
				});
				series.push({
					name : 'PB',
					data : data.PB,
					color : colors[0],
				    lineWidth : 1,
					marker : {
						enabled : false,
					}
				});
                series.push({
					name : 'O3',
					data : data.O3,
					color : colors[2],
					lineWidth : 1,
					marker : {
						enabled : false,
					}
				});
                series.push({
					name : 'CO2',
					data : data.CO2,
					color : colors[2],
					lineWidth : 1,
					marker : {
						enabled : false,
					}
				});
                series.push({
					name : 'PM2_5',
					data : data.PM2_5,
					color : colors[2],
					lineWidth : 1,
					marker : {
						enabled : false,
					}
				});
                series.push({
					name : 'NH3',
					data : data.NH3,
					color : colors[2],
					lineWidth : 1,
					marker : {
						enabled : false,
					}
				});
                series.push({
					name : 'PM10',
					data : data.PM10,
					color : colors[2],
					lineWidth : 1,
					marker : {
						enabled : false,
					}
				});
				series.push({
						name : 'SO2',
						data : data.SO2,
						color : colors[2],
						lineWidth : 1,
						marker : {
							enabled : false,
						}
					});
				
				return series;
			};
			
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
				// console.log(id + ' >> ' + tabIndex);
				$(id).each(function() {
					// console.log('each');
					var chart = new Highcharts.Chart({
						type : 'spline',
						animation : Highcharts.svg,
						marginRight : 10,
						chart : {
							renderTo : this
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
							categories : dataX
						},

						yAxis : {
							title : {
								text : 'Sensor Values'
							},
						},

						series : dataY

					});
				

				});
		
			
			};
		 
	    	}]);

});