define([ 'angular', './controllers-module'], function(angular, controllers) {
	'use strict';
	controllers.controller('SensorDataController', [ '$scope', '$http', '$state', '$log', 'PredixAssetService', 'PredixViewService',  '$interval', 'AqiService', '$rootScope', 'AuthService',  'SensorDataService',
			function($scope, $http, $state, $log, PredixAssetService, PredixViewService,  $interval, AqiService, $rootScope, AuthService, SensorDataService) {
		
		var intervalPromiseSensor = null;
		$scope.sensorData = null;
		var sensorCharts = [];
		var startDynamiUpdate = function() {
			intervalPromiseSensor = $interval(function() {
				realSensorData();
			}, 20000);
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
			SensorDataService.loadSensorData(function(res){
				   $scope.sensor= [];
	    		   $scope.len = res.length;
			       console.log("length of the data is :" +$scope.len);
			       for (var i = 0; i < $scope.len; i++) {
			    	    //$scope.sensor = null;
			    	    var data = res[i];
			    	    $scope.sensor[i] = data;
			    	    $scope.slen = $scope.sensor.length;
			    	    console.log("data in the sensor:" + $scope.slen);
			    	    data.temperature = [];
						data.PB = [];
						data.O3 = [];
					    data.CO2 = [];
						data.PM2_5 = [];
						data.NH3 = [];
						data.PM10 = [];
						data.SO2 = [];
					    data.timestamp = [];
				        for (var j = 0; j < $scope.slen; j++) {
						 
						$scope.sensor= [];
						data.temperature.push(res[j].temperature);
						data.PB.push(res[j].PB);
						data.O3.push(res[j].O3);
						data.CO2.push(res[j].CO2);
						data.PM2_5.push(res[j].PM2_5);
						data.NH3.push(res[j].NH3);
						data.PM10.push(res[j].PM10);
						data.SO2.push(res[j].SO2);
						data.timestamp.push(res[j].timestamp);
						
					
					}$scope.sensor= [];
					
					 var maxIndex = getMaxIndex(data);
				     var series = getSeries(data);
				 //   var timestamps = SensorDataService.prettyMs([ data.timestamp[maxIndex] ])[0];
				/*	if (i < sensorCharts[$scope.tabIndex].series.length - 1) {
						var l = sensorCharts[$scope.tabIndex].series[0].data.length;
						if (l > 0) {
							var lastTimeStamp = sensorCharts[$scope.tabIndex].series[i].data[l - 1]['name'];
							if (!lastTimeStamp) {
								lastTimeStamp = sensorCharts[$scope.tabIndex].series[i].data[l - 1]['category'];
							}
							if (lastTimeStamp !== timestamps) {
								sensorCharts[$scope.tabIndex].series[i].addPoint([ timestamps, series[i].data[maxIndex] ], false, true);
								//console.log('adde to graph : ' + lastTimeStamp + '  ' + timestamps);
							} else {
								//console.log('Same time stamp : ' + lastTimeStamp + '  ' + timestamps);
							}
						}

					}else {
						var l = sensorCharts[$scope.tabIndex].series[0].data.length;
						if (l > 0) {
							var lastTimeStamp = sensorCharts[$scope.tabIndex].series[i].data[l - 1]['name'];
							if (!lastTimeStamp) {
								lastTimeStamp = sensorCharts[$scope.tabIndex].series[i].data[l - 1]['category'];
							}
							if (lastTimeStamp !== timestamps) {
								sensorCharts[$scope.tabIndex].series[i].addPoint([ timestamps, series[i].data[maxIndex] ], true, true);
								//console.log('adde to graph : ' + lastTimeStamp + '  ' + timestamps);
							} else {
								//console.log('Same time stamp : ' + lastTimeStamp + '  ' + timestamps);
							}
						}

					}*/
				 
				
			   }
			   loadValuesToGraph('container');
          });
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
			
			
			var loadValuesToGraph = function(id) {
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
								return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + Highcharts.numberFormat(this.y, 2);
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
							categories : SensorDataService.prettyMs(timestamp)
						},

						yAxis : {
							title : {
								text : 'Sensor Values'
							},
						},

						series : getSeries()

					});
				

				});
		
			}
			};
		 
	    	}]);

});