define([ 'angular', './controllers-module'], function(angular, controllers) {
	'use strict';
	controllers.controller('AqiController', [ '$scope', '$http', '$state', '$log', 'PredixAssetService', 'PredixViewService', 'CalculationOneService', 'CalculationService', '$interval', 'AqiService', '$rootScope', 'AuthService', 'HygieneService', 'DashBoardService',
			function($scope, $http, $state, $log, PredixAssetService, PredixViewService, CalculationOneService, CalculationService, $interval, AqiService, $rootScope, AuthService, HygieneService, DashBoardService) {
				var areaCharts = [];
				var areaGaugeCharts = [];
				var isLoading = false;
				var initVariables = function() {
					$scope.maxValue = 50;
					$scope.aqiAreaLoading = true;
					$scope.aqiAreaComparisonLoading = true;
					$scope.aqiMachineLoading = true;
					$scope.aqiAreaData = null;
					$scope.aqiAreaComparison = null;
					$scope.aqiMachineData = null;
					$scope.tabIndexArea = 0;
					$scope.tabIndexMachine = 0;
					$scope.tabIndexAreaComparison = 0;
					$scope.tabIndexMachineComparison = 0;
					$scope.aqiAreaComparisonLastWeek = null;
					areaCharts = [];
					areaGaugeCharts = [];
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

				var interval = 50 * 1000;
				var refreshInterval = 20 * 1000;
				var intervalPromiseMachine = null;
				var intervalPromiseArea = null;

				$scope.floor = 0;
				$scope.changeFloor = function(floor) {
					if (!$scope.aqiMachineLoading && !$scope.aqiMachineLoading) {
						$scope.floor = floor;
						$scope.stop();
						initVariables();
						loadData();
					}
				};
				var dynamicUpdateMachineStarted = false;
				var dynamicUpdateAreaStarted = false;
				var startDynamicUpdateMachine = function() {
					intervalPromiseMachine = $interval(function() {
						loadAqiMachine($scope.floor);
					}, 20000);
				};

				var startDynamicUpdateArea = function() {
					// console.log('intervalPromiseArea>>');
					intervalPromiseArea = $interval(function() {
						// console.log('intervalPromiseArea');
						loadAqiArea($scope.floor);
					}, 20000);
				};

				$scope.aqiTabChange = function(key) {
					console.log(key);
					switch (key) {
					case 'aqi':
						$scope.selectTab($scope.tabIndexMachine, 'machine');
						break;
					case 'aqi-comparison':
						$scope.selectTab($scope.tabIndexAreaComparison, 'comparison');
						break;

					default:
						break;
					}
				};

				$scope.$on('$destroy', function() {
					$scope.stop();
				});

				$scope.stop = function() {
					$interval.cancel(intervalPromiseMachine);
					$interval.cancel(intervalPromiseArea);
				};

				// console.log($scope.floor);
				var loadData = function() {
					AuthService.getTocken(function(token) {
						loadAqiMachine($scope.floor);
						loadAqiArea($scope.floor);
					});
				};
				loadData();
				var loadAqiMachine = function(floor) {
					// console.log(!$scope.aqiMachineData);
					// console.log($scope.tabIndexMachine);
					if (!$scope.aqiMachineData) {
						$scope.aqiMachineLoading = true;
						DashBoardService.getAqiMachineValues(floor, interval, function(res) {
							if (res.length > 0) {
								$scope.aqiMachineData = res[0].assets;
								$("#aqi-machine-tab-content").fadeIn();
								$scope.selectTab($scope.tabIndexMachine, 'machine');
								if (!dynamicUpdateMachineStarted) {
									startDynamicUpdateMachine();
									dynamicUpdateMachineStarted = true;
								}
							}
							$scope.aqiMachineLoading = false;
						});
					} else {
						DashBoardService.getAqiMachineValues(floor, interval, function(res) {
							if (res.length > 0) {
								$scope.aqiMachineData = res[0].assets;
								// console.log($scope.tabIndexMachine);
								$scope.selectTab($scope.tabIndexMachine, 'machine');
							}
						});
					}

				};
				var getMahineComponets = function(data) {
					// console.log(data);
					var components = {};
					for (var i = 0; i < data.length; i++) {
						components[data[i].name] = 0.0;
						for (var j = 0; j < data[i].values.length; j++) {
							// console.log(components[data[i].name] + ' ' +
							// data[i].values[j]);
							if (components[data[i].name] < data[i].values[j]) {
								components[data[i].name] = data[i].values[j];
							}
						}
					}
					return components;
				};

				var loadAqiArea = function(floor) {
					if (!$scope.aqiAreaData) {
						$scope.aqiAreaLoading = true;
						$scope.aqiAreaComparisonLoading = true;
						DashBoardService.getAqiAreaValues(floor, interval, function(res) {
							if (res.length > 0) {
								$scope.aqiAreaData = res[0].assets;
								$scope.aqiAreaComparison = res[0].assets;
								loadGaugeChart('#aqi_area_comparison_chart_' + $scope.tabIndexAreaComparison, $scope.aqiAreaComparison[$scope.tabIndexAreaComparison].data.maxAqi.aqiValue);
								// console.log('getAqiAreaValues > ' +
								// $scope.aqiAreaComparisonLastWeek)
								// console.log('$scope.aqiAreaComparison > ' +
								// $scope.aqiAreaComparison);
								if ($scope.aqiAreaComparisonLastWeek) {
									loadGaugeChart('#aqi_area_comparison_chart_last_week_' + $scope.tabIndexAreaComparison, $scope.aqiAreaComparisonLastWeek[$scope.tabIndexAreaComparison].data.maxAqi.aqiValue);
									$scope.aqiAreaComparison[$scope.tabIndexAreaComparison].data.maxAqiLastWeek = $scope.aqiAreaComparisonLastWeek[$scope.tabIndexAreaComparison].data.maxAqi;
									// console.log('getAqiAreaValues');
									// console.log($scope.aqiAreaComparisonLastWeek);
								}

								$("#aqi-area-tab-content").fadeIn();
								$scope.selectTab($scope.tabIndexArea, 'area');
								if (!dynamicUpdateAreaStarted) {
									startDynamicUpdateArea();
									dynamicUpdateAreaStarted = true;
								}
							}
							$scope.aqiAreaLoading = false;
							$scope.aqiAreaComparisonLoading = false;

							DashBoardService.getAqiAreaLastWeek(floor, interval, function(res) {

								if (res.length > 0) {
									// console.log('getAqiAreaLastWeek > ' +
									// $scope.aqiAreaComparison);
									if ($scope.aqiAreaComparison) {
										$scope.aqiAreaComparisonLastWeek = res[0].assets;
										// console.log('$scope.aqiAreaComparisonLastWeek
										// > ' +
										// $scope.aqiAreaComparisonLastWeek);
										loadGaugeChart('#aqi_area_comparison_chart_last_week_' + $scope.tabIndexAreaComparison, $scope.aqiAreaComparisonLastWeek[$scope.tabIndexAreaComparison].data.maxAqi.aqiValue);
										$scope.aqiAreaComparison[$scope.tabIndexAreaComparison].data.maxAqiLastWeek = $scope.aqiAreaComparisonLastWeek[$scope.tabIndexAreaComparison].data.maxAqi;
										// console.log('getAqiAreaLastWeek');
										// console.log($scope.aqiAreaComparisonLastWeek);
									}
								}
							});

						});

					} else {
						DashBoardService.getAqiAreaValues(floor, interval, function(res) {
							if (res.length > 0) {
								// console.log(res[0]);
								var last = findLastValue(res[0].assets[$scope.tabIndexArea].data.timestamps);
								var x = res[0].assets[$scope.tabIndexArea].data.timestamps[last];
								var y = res[0].assets[$scope.tabIndexArea].data.value[last];
								var timestamps = DashBoardService.prettyMs([ x ])[0];
								var l = areaCharts[$scope.tabIndexArea].series[0].data.length;
								if (l > 0) {
									var lastTimeStamp = areaCharts[$scope.tabIndexArea].series[0].data[l - 1]['name'];
									if (!lastTimeStamp) {
										lastTimeStamp = areaCharts[$scope.tabIndexArea].series[0].data[l - 1]['category'];
									}
									// console.log(lastTimeStamp);
									// console.log(timestamps);
									if (lastTimeStamp !== timestamps) {
										areaCharts[$scope.tabIndexArea].series[0].addPoint([ timestamps, y ], true, true);
									} else {
										console.log('Same time stamp : ' + lastTimeStamp + '  ' + timestamps);
									}
								}

							}
						});
					}

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
						$('.graph_class').hide();
						$('.area_gauge_chart_base').hide();
						setTimeout(function() {
							$('.graph_class').fadeIn();
							loadValuesToGraph('#area_chart_' + index, DashBoardService.prettyMs($scope.aqiAreaData[index].data.timestamps), $scope.aqiAreaData[index].data.value, index);
							loadGaugeChart('#area_gauge_chart_' + index, $scope.aqiAreaData[index].data.maxAqi.aqiValue);
							$('.area_gauge_chart_base').fadeIn();

						}, 300);
					} else if (type === 'machine') {
						$scope.tabIndexMachine = index;
						// Hard coded Image Urls

						// images/machine.jpg
						// images/wave_soldering_machine.png
						// images/soltech_machine (1).png
						// images/reflow_oven.png
						switch ($scope.aqiMachineData[index].assetName) {
						case 'Soltech-Machine':
							$scope.aqiMachineData[index].data.imageUrl = 'images/soltech_machine (1).png';
							break;
						case 'Reflow-Ovan':
							$scope.aqiMachineData[index].data.imageUrl = 'images/reflow_oven.png';
							break;
						case 'Wave-Soldering-Machine':
							$scope.aqiMachineData[index].data.imageUrl = 'images/wave_soldering_machine.png';
							break;
						case 'Heller-Machine':
							$scope.aqiMachineData[index].data.imageUrl = 'images/machine.jpg';
							break;

						default:
							break;
						}
						$scope.aqiMachineData[index].data.components = getMahineComponets($scope.aqiMachineData[index].data.seperatedResult);
						$scope.aqiMachineData[index].data.status = getStatus($scope.aqiMachineData[index].data.maxAqi.name, $scope.aqiMachineData[index].data.maxAqi.aqiValue);
						// console.log($scope.aqiMachineData[index].data);

						// console.log(">> " + $scope.tabIndexMachine);
					} else if (type === 'comparison') {
						$scope.tabIndexAreaComparison = index;
						if ($scope.aqiAreaComparison) {
							loadGaugeChart('#aqi_area_comparison_chart_' + index, $scope.aqiAreaComparison[index].data.maxAqi.aqiValue);
						}
						if ($scope.aqiAreaComparisonLastWeek) {
							loadGaugeChart('#aqi_area_comparison_chart_last_week_' + index, $scope.aqiAreaComparisonLastWeek[index].data.maxAqi.aqiValue);

						}
						if ($scope.aqiAreaComparisonLastWeek && $scope.aqiAreaComparison) {
							$scope.aqiAreaComparison[$scope.tabIndexAreaComparison].data.maxAqiLastWeek = $scope.aqiAreaComparisonLastWeek[$scope.tabIndexAreaComparison].data.maxAqi;
						}
					}

				};
				var graphColor = '#00acec';

				var loadGaugeChart = function(id, value) {
					loadChart(id, 0, 200, value);
				};

				var loadValuesToGraph = function(id, dataX, dataY, index) {
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
								categories : dataX
							},

							yAxis : {
								title : {
									text : 'Air value'
								},
							},

							series : [ {
								name : 'AQI',
								data : dataY,
								type : 'areaspline',
								color : graphColor,
								fillColor : {
									linearGradient : {
										x1 : 0,
										y1 : 1,
										x2 : 0,
										y2 : 1
									},
									stops : [ [ 1, graphColor ], [ 0, Highcharts.Color(graphColor).setOpacity(0).get('red') ], ]

								},
								lineWidth : 1,
								marker : {
									enabled : false,
								}

							} ]
						});
						areaCharts[index] = chart;
					});
				};

				var getColorForPercentage = function(pct) {
					// console.log(pct);

					for (var i = 1; i < percentColors.length - 1; i++) {
						if (pct < percentColors[i].pct) {
							break;
						}
					}
					var lower = percentColors[i - 1];
					var upper = percentColors[i];
					var range = upper.pct - lower.pct;
					var rangePct = (pct - lower.pct) / range;
					var pctLower = 1 - rangePct;
					var pctUpper = rangePct;
					var color = {
						r : Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
						g : Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
						b : Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
					};
					return 'rgb(' + [ color.r, color.g, color.b ].join(',') + ')';
					// or output as hex if preferred
				}

				var loadChart = function(selector, min, max, val) {
					var per = (val / max);
					var chart = c3.generate({
						bindto : selector,
						data : {

							columns : [ [ 'data', val ] ],
							type : 'gauge'
						},
						gauge : {
							label : {
								format : function(value, ratio) {
									return value;
								},
								pattern : 'green'
							},
							min : min,
							max : max,
							units : '',
							width : 15
						},
						color : {
							pattern : [ getColorForPercentage(per) ]
						},
						size : {
							height : 155,
							width : 150
						}
					});
				};
				var percentColors = [ {
					pct : 0.0,
					color : {

						r : 0x00,
						g : 0xff,
						b : 0
					}
				}, {
					pct : 0.5,
					color : {
						r : 0xff,
						g : 0xff,
						b : 0
					}
				}, {
					pct : 1.0,
					color : {
						r : 0xff,
						g : 0x00,
						b : 0
					}
				} ];

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
				
				
				$scope.details = function(floor) {
					$scope.floor = floor;
					$state.go('aqi-details', {
							'floor' : floor		
					});
					 
			    };
				
				
			} ]);

});