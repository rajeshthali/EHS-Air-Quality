define([ 'angular', './controllers-module'], function(angular, controllers) {
	'use strict';
	controllers.controller('AQIDetailsPageController', [ '$state', '$timeout', '$interval', '$scope', '$rootScope', '$http', '$log', 'PredixAssetService', 'PredixViewService', 'AuthService', 'HygieneService', 'DashBoardService', '$stateParams',
			function($state, $timeout, $interval, $scope, $rootScope, $http, $log, PredixAssetService, PredixViewService, AuthService, HygieneService, DashBoardService, $stateParams) {
				// console.log($stateParams);

				var areaCharts = [];
				var machineCharts = [];

				var initVariables = function() {
					areaCharts = [];
					machineCharts = [];
					$scope.maxValue = 50;
					$scope.aqiAreaLoading = true;
					$scope.aqiMachineLoading = true;
					$scope.aqiAreaData = null;
					$scope.aqiMachineData = null;
					$scope.tabIndexArea = 0;
					$scope.tabIndexMachine = 0;
					$scope.tabIndexMachineComparison = 0;
				};
				initVariables();

				$scope.floors = [ {
					name : 'F1',
					id : 0
				}, {
					name : 'F2',
					id : 1
				}, {
					name : 'F3',
					id : 2
				} ];
				
			   //Rohit
				$scope.floor =  $stateParams.floor;
				console.log("undefined floor"+$stateParams.floor);
                if($stateParams.floor == null){
				   $scope.floor = 0;
				}
				else{
				 $scope.floor =  $stateParams.floor;
				}
                
                
                $scope.changeFloor = function(floor) {
					if (!$scope.aqiAreaLoading && !$scope.aqiMachineLoading) {
						$scope.floor = floor;
						$scope.stop();
						initVariables();
						loadData();
					}
				};

				var interval = 2 * 60 * 1000;
				var refreshInterval = 20 * 1000;
				var intervalPromiseMachine = null;
				var intervalPromiseArea = null;
                var startDynamicUpdateMachine = function() {
					intervalPromiseMachine = $interval(function() {
						loadAqiMachine($scope.floor);
					}, 20000);
				};

				var startDynamicUpdateArea = function() {
					intervalPromiseArea = $interval(function() {
						loadAqiArea($scope.floor);
					}, 20000);
				};

				$scope.$on('$destroy', function() {
					$scope.stop();
				});

				$scope.stop = function() {
					$interval.cancel(intervalPromiseMachine);
					$interval.cancel(intervalPromiseArea);
				};

				var loadData = function() {
					AuthService.getTocken(function(token) {
						loadAqiMachine($scope.floor);
						loadAqiArea($scope.floor);
					});
				};
				loadData();

				var loadAqiArea = function(floor) {
					if (!$scope.aqiAreaData) {
						$scope.aqiAreaLoading = true;
						DashBoardService.getAqiAreaValues(floor, interval, function(res) {
							if (res.length > 0) {
								
								$scope.floorName = floor;
								
								$scope.aqiAreaData = res[0].assets;
								$scope.aqiAreaComparison = res[0].assets;
								$("#aqi-area-tab-content").fadeIn();
								$scope.selectTab($scope.tabIndexArea, 'area');
								startDynamicUpdateArea();
							}
							$scope.aqiAreaLoading = false;
						});
					} else {
						DashBoardService.getAqiAreaValues(floor, interval, function(res) {
							if (res.length > 0) {

								$scope.floorName = floor;
								
								var last = findLastValue(res[0].assets[$scope.tabIndexArea].data.timestamps);
								var x = res[0].assets[$scope.tabIndexArea].data.timestamps[last];
								var y = res[0].assets[$scope.tabIndexArea].data.value[last];

								var series = getSeries(res[0].assets[$scope.tabIndexArea].data.seperatedResult);
								for (var i = 0; i < areaCharts[$scope.tabIndexArea].series.length; i++) {
									var timestamps = DashBoardService.prettyMs([ x ])[0];
									if (i < areaCharts[$scope.tabIndexArea].series.length - 1) {

										var l = areaCharts[$scope.tabIndexArea].series[0].data.length;
										if (l > 0) {
											var lastTimeStamp = areaCharts[$scope.tabIndexArea].series[i].data[l - 1]['name'];
											if (!lastTimeStamp) {
												lastTimeStamp = areaCharts[$scope.tabIndexArea].series[i].data[l - 1]['category'];
											}
											if (lastTimeStamp !== timestamps) {
												areaCharts[$scope.tabIndexArea].series[i].addPoint([ timestamps, series[i].data[last] ], false, true);
											} else {
											}
										}

									} else {

										var l = areaCharts[$scope.tabIndexArea].series[0].data.length;
										if (l > 0) {
											var lastTimeStamp = areaCharts[$scope.tabIndexArea].series[i].data[l - 1]['name'];
											if (!lastTimeStamp) {
												lastTimeStamp = areaCharts[$scope.tabIndexArea].series[i].data[l - 1]['category'];
											}
											if (lastTimeStamp !== timestamps) {
												areaCharts[$scope.tabIndexArea].series[i].addPoint([ timestamps, series[i].data[last] ], true, true);
											} else {
												console.log('Same time stamp : ' + lastTimeStamp + '  ' + timestamps);
											}
										}
									}
								}
							}
						});
					}

				};
				var loadAqiMachine = function(floor) {
					if (!$scope.aqiMachineData) {
						$scope.aqiMachineLoading = true;
						DashBoardService.getAqiMachineValues(floor, interval, function(res) {
							if (res.length > 0) {
								$scope.aqiMachineData = res[0].assets;
								$("#aqi-machine-tab-content").fadeIn();
								$scope.selectTab($scope.tabIndexMachine, 'machine');
								startDynamicUpdateMachine();
							}
							$scope.aqiMachineLoading = false;
						});
					} else {
						DashBoardService.getAqiMachineValues(floor, interval, function(res) {
							if (res.length > 0) {
								var last = findLastValue(res[0].assets[$scope.tabIndexMachine].data.timestamps);
								var x = res[0].assets[$scope.tabIndexMachine].data.timestamps[last];
								var y = res[0].assets[$scope.tabIndexMachine].data.value[last];

								var series = getSeries(res[0].assets[$scope.tabIndexMachine].data.seperatedResult);
								for (var i = 0; i < machineCharts[$scope.tabIndexMachine].series.length; i++) {
									var timestamps = DashBoardService.prettyMs([ x ])[0];
									if (i < machineCharts[$scope.tabIndexMachine].series.length - 1) {

										var l = areaCharts[$scope.tabIndexMachine].series[0].data.length;
										if (l > 0) {
											var lastTimeStamp = areaCharts[$scope.tabIndexMachine].series[i].data[l - 1]['name'];
											if (!lastTimeStamp) {
												lastTimeStamp = areaCharts[$scope.tabIndexMachine].series[i].data[l - 1]['category'];
											}
											if (lastTimeStamp !== timestamps) {
												machineCharts[$scope.tabIndexMachine].series[i].addPoint([ timestamps, series[i].data[last] ], false, true);
											} else {
												console.log('Same time stamp : ' + lastTimeStamp + '  ' + timestamps);
											}
										}

									} else {
										var l = areaCharts[$scope.tabIndexMachine].series[0].data.length;
										if (l > 0) {
											var lastTimeStamp = areaCharts[$scope.tabIndexMachine].series[i].data[l - 1]['name'];
											if (!lastTimeStamp) {
												lastTimeStamp = areaCharts[$scope.tabIndexMachine].series[i].data[l - 1]['category'];
											}
											if (lastTimeStamp !== timestamps) {
												machineCharts[$scope.tabIndexMachine].series[i].addPoint([ timestamps, series[i].data[last] ], true, true);
											} else {
												console.log('Same time stamp : ' + lastTimeStamp + '  ' + timestamps);
											}
										}

									}
								}

							}
						});
					}

				};
				var getMahineComponets = function(data) {
					var components = {};
					for (var i = 0; i < data.length; i++) {
						components[data[i].name] = 0.0;
						for (var j = 0; j < data[i].values.length; j++) {
							if (components[data[i].name] < data[i].values[j]) {
								components[data[i].name] = data[i].values[j];
							}
						}
					}
					return components;
				};

				var findLastValue = function(timestamps) {
					var big = 0;
					var index = 0;
					for (var i = 0; i < timestamps.length; i++) {
						if (big < timestamps[i]) {
							big = timestamps[i];
							index = i;
						}
					}
					return index;
				};

				$scope.selectTab = function(index, type) {
					if (type === 'area') {
						$scope.tabIndexArea = index;
						$scope.aqiAreaData[index].data.status = getStatus($scope.aqiAreaData[index].data.maxAqi.name, $scope.aqiAreaData[index].data.maxAqi.aqiValue);
						$('.aqi_details_graph_class').hide();
						$('.area_gauge_chart_base').hide();
						setTimeout(function() {
							$('.aqi_details_graph_class').fadeIn();
							loadValuesToGraph('#area_chart_' + index, DashBoardService.prettyMs($scope.aqiAreaData[index].data.timestamps), $scope.aqiAreaData[index].data.seperatedResult, index, type);
						}, 300);
					} else if (type === 'machine') {
						$scope.tabIndexMachine = index;
						setTimeout(function() {
							$('.aqi_details_graph_class_machine').fadeIn();
							loadValuesToGraph('#machine_chart_' + index, DashBoardService.prettyMs($scope.aqiMachineData[index].data.timestamps), $scope.aqiMachineData[index].data.seperatedResult, index, type);
						}, 300);
					}

				};
				var graphColor = '#00acec';

				var loadValuesToGraph = function(id, dataX, dataY, index, type) {

					$(id).each(function() {
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
								categories : dataX
							},

							yAxis : {
								title : {
									text : 'Air value'
								},
							},

							series : getSeries(dataY)

						});
						if (type === 'area') {
							areaCharts[index] = chart;
						} else {
							machineCharts[index] = chart;
						}

					});
				};

				var getSeries = function(dataY) {
					var colors = [ '#8BBE3D', '#00acec', '#242326', '#ff9000', '#8bd6f6', '#8669ff', '#28b779' ];
					var series = [];
					for (var i = 0; i < dataY.length; i++) {
						series.push({
							name : dataY[i].name,
							data : dataY[i].values,
							type : 'spline',
							color : colors[i],
							lineWidth : 1,
							marker : {
								enabled : false,
							}

						});
					}

					return series;
				};
				var getStatus = function(prominentParameter, max) {
					var status = '';
					switch (prominentParameter) {
					case 'PM10':
						if (max >= 0 && max <= 50) {
							var status = 'Good';
						} else if (max >= 51 && max <= 100) {
							status = 'Satisfactory';

						} else if (max >= 101 && max <= 250) {
							status = 'Moderate';

						} else if (max >= 251 && max <= 350) {
							status = 'Poor';

						} else if (max >= 351 && max <= 430) {
							status = 'Very Poor';

						} else if (max > 430) {
							status = 'Severe';

						}

						break;
					case 'PM2_5':
						if (max >= 0 && max <= 30) {
							status = 'Good';
						} else if (max >= 31 && max <= 60) {
							status = 'Satisfactory';

						} else if (max >= 61 && max <= 90) {
							status = 'Moderate';

						} else if (max >= 91 && max <= 120) {
							status = 'Poor';

						} else if (max >= 121 && max <= 250) {
							status = 'Very Poor';

						} else if (max > 250) {
							status = 'Severe';

						}
						break;
					case 'NO2':
						if (max >= 0 && max <= 40) {
							status = 'Good';

						} else if (max >= 41 && max <= 80) {
							status = 'Satisfactory';

						} else if (max >= 81 && max <= 180) {
							status = 'Moderate';

						} else if (max >= 181 && max <= 280) {
							status = 'Poor';

						} else if (max >= 281 && max <= 400) {
							status = 'Very Poor';

						} else if (max > 400) {
							status = 'Severe';

						}
						break;
					case 'O3':
						if (max >= 0 && max <= 50) {
							status = 'Good';

						} else if (max >= 51 && max <= 100) {
							status = 'Satisfactory';

						} else if (max >= 101 && max <= 168) {
							status = 'Moderate';

						} else if (max >= 169 && max <= 208) {
							status = 'Poor';

						} else if (max >= 209 && max <= 748) {
							status = 'Very Poor';

						} else if (max > 748) {
							status = 'Severe';

						}
						break;
					case 'CO2':
						if (max >= 0 && max <= 1.0) {
							status = 'Good';

						} else if (max >= 1.1 && max <= 2.0) {
							status = 'Satisfactory';

						} else if (max >= 2.1 && max <= 10) {
							status = 'Moderate';

						} else if (max >= 10.1 && max <= 17) {
							status = 'Poor';

						} else if (max >= 17.1 && max <= 34) {
							status = 'Very Poor';

						} else if (max > 34) {
							status = 'Severe';

						}
						break;
					case 'SO2':
						if (max >= 0 && max <= 40) {
							status = 'Good';

						} else if (max >= 41 && max <= 80) {
							status = 'Satisfactory';

						} else if (max >= 81 && max <= 380) {
							status = 'Moderate';

						} else if (max >= 381 && max <= 800) {
							status = 'Poor';

						} else if (max >= 801 && max <= 1600) {
							status = 'Very Poor';

						} else if (max > 1600) {
							status = 'Severe';

						}
						break;
					case 'NH3':
						if (max >= 0 && max <= 200) {
							status = 'Good';

						} else if (max >= 201 && max <= 400) {
							status = 'Satisfactory';

						} else if (max >= 401 && max <= 800) {
							status = 'Moderate';

						} else if (max >= 801 && max <= 1200) {
							status = 'Poor';

						} else if (max >= 801 && max <= 1200) {
							status = 'Poor';

						} else if (max >= 1201 && max <= 1800) {
							status = 'Very Poor';

						} else if (max > 1800) {
							status = 'Severe';

						}
						break;
					case 'PB':
						if (max >= 0 && max <= 0.5) {
							status = 'Good';

						} else if (max >= 0.6 && max <= 1.0) {
							status = 'Satisfactory';

						} else if (max >= 1.1 && max <= 2.0) {
							status = 'Moderate';

						} else if (max >= 2.1 && max <= 3.0) {
							status = 'Poor';

						} else if (max >= 3.1 && max <= 3.5) {
							status = 'Very Poor';

						} else if (max > 3.5) {
							status = 'Severe';

						}
						break;

					default:
						break;
					}

					return status;

				};
			} ]);

});
