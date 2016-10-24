define([ 'angular', './controllers-module'], function(angular, controllers) {
	'use strict';
	controllers.controller('WaterConsumptionController', [ '$scope', '$http', '$state', '$log', 'PredixAssetService', 'PredixViewService', 'CalculationOneService', 'CalculationService', '$interval', 'AqiService', '$rootScope', 'AuthService', 'HygieneService', 'DashBoardService',
			function($scope, $http, $state, $log, PredixAssetService, PredixViewService, CalculationOneService, CalculationService, $interval, AqiService, $rootScope, AuthService, HygieneService, DashBoardService) {
				var areaCharts = [];
				var hygieneCharts = [];
				var areaGaugeCharts = [];
				var isLoading = false;
				var promise = 0;
				$scope.hygieneLoading = false;
				var hygieneInterval = null;
				var interval = 1000 * 60 * 2;
				var intervalDynamic = 1000 * 30;
				var initVariables = function() {
					$scope.maxValue = 50;
					$scope.aqiAreaLoading = true;
					$scope.aqiAreaComparisonLoading = true;
					$scope.aqiMachineLoading = true;
					$scope.aqiAreaData = null;
					$scope.aqiAreaComparison = null;
					$scope.aqiMachineData = null;
					$scope.tabIndexArea = 0;
					$scope.tabIndex = 0;
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
					if (!$scope.aqiMachineLoading && !$scope.aqiMachineLoading && !$scope.hygieneLoading) {
						$scope.floor = floor;
						hygieneCharts = [];
						$scope.floor = floor;
						$scope.tabIndex = 0;
						$scope.hygieneLoading = false;
						$scope.hygieneData = null;
						$scope.stop();
						initVariables();
						loadData();
					}
				};
				
				/*$scope.changeFloor = function(floor) {
					if (!$scope.hygieneLoading) {
						hygieneCharts = [];
						$scope.stop();
						$scope.floor = floor;
						$scope.tabIndex = 0;
						$scope.hygieneLoading = false;
						$scope.hygieneData = null;
						loadData();
					}
				};
				*/
				$scope.showMe = false;
				$scope.gotoDetailsView = function() {
						
					$scope.showMe = true;
				};
				
				$scope.$on('$destroy', function() {
					$scope.stop();
				});

				$scope.stop = function() {
					$interval.cancel(promise);
				};
				
				
				var dynamicUpdateMachineStarted = false;
				var dynamicUpdateAreaStarted = false;
				var startDynamicUpdateMachine = function() {
					intervalPromiseMachine = $interval(function() {
						loadAqiMachine($scope.floor);
						loadHygiene($scope.floor);
					}, 20000);
				};

				var startDynamicUpdateArea = function() {
					// console.log('intervalPromiseArea>>');
					intervalPromiseArea = $interval(function() {
						// console.log('intervalPromiseArea');
						loadAqiArea($scope.floor);
					}, 20000);
				};

				var startDynamiUpdate = function() {
					console.log('running startDynamiUpdate..');
					promise = $interval(function() {
						loadHygiene($scope.floor);
					}, 20000);
				};
				
				var loadData = function() {
					$scope.hygieneLoading = true;
					AuthService.getTocken(function(token) {
						loadAqiMachine($scope.floor);
						loadAqiArea($scope.floor);
						loadHygiene($scope.floor);
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

				
				
				var loadHygiene = function(floor) {
					if (!$scope.hygieneData) {
						DashBoardService.getHygieneValues(floor, interval, function(res) {

							$scope.hygieneData = res[0].assets;
							// console.log($scope.hygieneData);

							for (var i = 0; i < $scope.hygieneData.length; i++) {
								var asset = $scope.hygieneData[i];
								$scope.hygieneData[i].temperature = [];
								$scope.hygieneData[i].humidity = [];
								$scope.hygieneData[i].noise = [];
								$scope.hygieneData[i].timestamp = [];
								for (var j = 0; j < asset.data.length; j++) {
									$scope.hygieneData[i].timestamp.push(asset.data[j].timestamp);
									$scope.hygieneData[i].humidity.push(asset.data[j].humidity);
									$scope.hygieneData[i].noise.push(asset.data[j].noise);
									$scope.hygieneData[i].temperature.push(asset.data[j].temperature);
								}

							}
							$scope.hygieneLoading = false;
							$scope.selectTab1($scope.tabIndex);
							//$scope.options = loadGraph($scope.tabIndex);
							
							console.log("graph " +$scope.tabIndex);
							$scope.chartfunc2($scope.options);
							startDynamiUpdate();
						});
					} else {
						DashBoardService.getHygieneValues(floor, intervalDynamic, function(res) {

							var data = res[0].assets;
							// console.log($scope.hygieneData);
							for (var i = 0; i < data.length; i++) {
								var asset = data[i];
								data.temperature = [];
								data.humidity = [];
								data.noise = [];
								data.timestamp = [];
								for (var j = 0; j < asset.data.length; j++) {
									data.timestamp.push(asset.data[j].timestamp);
									data.humidity.push(asset.data[j].humidity);
									data.noise.push(asset.data[j].noise);
									data.temperature.push(asset.data[j].temperature);
								}
								var maxIndex = getMaxIndex(data);
								var series = getSeries($scope.tabIndex, data)
								var timestamps = DashBoardService.prettyMs([ data.timestamp[maxIndex] ])[0];
								if (i < hygieneCharts[$scope.tabIndex].series.length - 1) {
									var l = hygieneCharts[$scope.tabIndex].series[0].data.length;
									if (l > 0) {
										var lastTimeStamp = hygieneCharts[$scope.tabIndex].series[i].data[l - 1]['name'];
										if (!lastTimeStamp) {
											lastTimeStamp = hygieneCharts[$scope.tabIndex].series[i].data[l - 1]['category'];
										}
										if (lastTimeStamp !== timestamps) {
											hygieneCharts[$scope.tabIndex].series[i].addPoint([ timestamps, series[i].data[maxIndex] ], false, true);
											//console.log('adde to graph : ' + lastTimeStamp + '  ' + timestamps);
										} else {
											//console.log('Same time stamp : ' + lastTimeStamp + '  ' + timestamps);
										}
									}

								} else {
									var l = hygieneCharts[$scope.tabIndex].series[0].data.length;
									if (l > 0) {
										var lastTimeStamp = hygieneCharts[$scope.tabIndex].series[i].data[l - 1]['name'];
										if (!lastTimeStamp) {
											lastTimeStamp = hygieneCharts[$scope.tabIndex].series[i].data[l - 1]['category'];
										}
										if (lastTimeStamp !== timestamps) {
											hygieneCharts[$scope.tabIndex].series[i].addPoint([ timestamps, series[i].data[maxIndex] ], true, true);
											//console.log('adde to graph : ' + lastTimeStamp + '  ' + timestamps);
										} else {
											//console.log('Same time stamp : ' + lastTimeStamp + '  ' + timestamps);
										}
									}

								}

							}

						});
					}
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

				
				
				var loadValuesToGraph1 = function(id, tabIndex) {
					// console.log(id + ' >> ' + tabIndex);
					$(id).each(function() {
						// console.log('each');
						var chart = new Highcharts.Chart({
							type : 'column',
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
								categories : DashBoardService.prettyMs($scope.hygieneData[tabIndex].timestamp)
							},

							yAxis : {
								title : {
									text : 'Hygiene Values'
								},
							},

							series : getSeries(tabIndex)

						});
						hygieneCharts[tabIndex] = chart;

					});
				}
				
				

				var getSeries = function(tabIndex, dataArg) {
					var colors = [ '#8BBE3D', '#00acec', '#242326', '#ff9000', '#8bd6f6', '#8669ff', '#28b779' ];
					var series = [];
					var data = null;
					if (dataArg) {
						data = dataArg;
					} else {
						data = $scope.hygieneData[tabIndex];
					}
					series.push({
						name : 'Noise',
						data : data.noise,
						color : colors[0],
						fillColor : {
			                    linearGradient : {
			                        x1: 1,
			                        y1: 0,
			                        x2: 0,
			                        y2: 1
			                     },
			                    stops : [
			                        [1, colors[1]],
			                        [0, colors[1]],
			                     ]},
						
						lineWidth : 1,
						marker : {
							enabled : false,
						}
					});
					series.push({
						name : 'humidity',
						data : data.humidity,
						color : colors[1],
					    fillColor : {
			                    linearGradient : {
			                        x1: 0,
			                        y1: 0,
			                        x2: 0,
			                        y2: 0
			                     },
			                    stops : [
			                        [1, colors[0]],
			                        [1, colors[0]],
			                     ]},
						  
						lineWidth : 1,
						marker : {
							enabled : false,
						}
					});
	                series.push({
						name : 'Temperature',
						data : data.temperature,
						color : colors[2],
						fillColor : {
		                    linearGradient : {
		                        x1: 1,
		                        y1: 0,
		                        x2: 0,
		                        y2: 1
		                     },
		                    stops : [
		                        [1, colors[2]],
		                        [0, colors[2]],
		                     ]},
						lineWidth : 1,
						marker : {
							enabled : false,
						}
					});
					
					return series;
				};
				
				
				
		
			  
			  
				$scope.selectTab1 = function(index) {
					$scope.tabIndex = index;
					$('.hygiene_details_graph_class').hide();
				    console.log("select tab index is: " +$scope.tabIndex)
				    setTimeout(function() {
							$('.hygiene_details_graph_class').fadeIn();
					         /* loadGraph(index);*/
					          $scope.options = loadGraph(index);
	     					  $scope.chartfunc2($scope.options ,index)

							/*  loadGraph(index);*/
					 }, 300);
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
				
				var loadGraph= function(index){	
			         var options = {
					      chart: {
					        events: {
					            drilldown: function (e) {
					                if (!e.seriesOptions) {

					                    var chart = this;
	                                     // Show the loading label
					                    chart.showLoading('Loading ...');

					                    setTimeout(function () {
					                        chart.hideLoading();
					                        chart.addSeriesAsDrilldown(e.point, series);
					                    }, 1000); 
					                }

					            }
					        },
					        plotBorderWidth: 0
					    },

					    title: {
					        text: '',
					    },
					   
					    subtitle: {
					            text: ''
					    },
					   
					    xAxis : {
							title : {
								text : 'Time'
							},
							categories : DashBoardService.prettyMs($scope.hygieneData[index].timestamp),
							crosshair: true
						},
					    
					    yAxis: {

					            title: {
					                margin: 10,
					                text: 'Hygiene Values'
					            },      
					    },
					    
					    legend: {
					        enabled: true,
					    },
					    
					    plotOptions: {
					        series: {
					            pointPadding: 0.2,
					            borderWidth: 0,
					            dataLabels: {
					                /*enabled: true*/
					                enabled: false
					            }
					          },
					       /* pie: {
					            plotBorderWidth: 0,
					            allowPointSelect: true,
					            cursor: 'pointer',
					            size: '100%',
					            dataLabels: {
					                enabled: true,
					                format: '{point.name}: <b>{point.y}</b>'
					            }
					        }*/
					    },
		         		 series: getSeries(index),
		         		   
					
					    drilldown: {
					        series: []
					    }
					   
					};
			        return options;
			  };
			  
			  
			  
				$scope.details = function(floor) {
					$scope.floor = floor;
					$state.go('aqi-details', {
							'floor' : floor		
					});
					 
			    };
			    
			    $scope.chartfunc1 = function(options, tabIndex)
				{
				  $(".charticon1").addClass("active_chart");
				  $(".charticon").removeClass("active_chart");
				  var column = document.getElementById('areaspline');
				  console.log("column is called");
				  $scope.options.chart.renderTo = 'container_'+ tabIndex;
				  $scope.options.chart.type = 'areaspline';
				  var chart1 = new Highcharts.Chart($scope.options);
				 };

			   $scope.chartfunc2 = function(options , index){
				  $(".charticon").addClass("active_chart");
				  $(".charticon1").removeClass("active_chart");
				  console.log("tab index: " +$scope.options);
				  var bar = document.getElementById('column');
				  console.log("bar is called");
				  $scope.options.chart.renderTo = 'container_'+ index;
				  $scope.options.chart.type = 'column';
			      var chart1 = new Highcharts.Chart($scope.options);
		          }; 
					
				
				
			} ]);

});