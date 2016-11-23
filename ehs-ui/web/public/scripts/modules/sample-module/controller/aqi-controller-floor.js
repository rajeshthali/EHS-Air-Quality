
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
					$scope.aqiAreaLoading2 = true;
					$scope.aqiAreaComparisonLoading = true;
					$scope.aqiMachineLoading = true;
					$scope.aqiAreaData = null;
					$scope.aqiAreaData2 = null;
					$scope.aqiAreaComparison = null;
					$scope.aqiMachineData = null;
					$scope.tabIndexArea = 0;
					$scope.tabIndexArea2 = 0;
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
				var dynamicUpdateAreaStarted2 = false;
				var startDynamicUpdateMachine = function() {
					intervalPromiseMachine = $interval(function() {
						loadAqiMachine($scope.floor);
					}, 20000);
				};

				var startDynamicUpdateArea = function() {
					
					intervalPromiseArea = $interval(function() {
						 console.log('intervalPromiseArea');
						loadAqiArea($scope.floor);
					}, 20000);
				};
				var startDynamicUpdateArea2 = function() {
					
					intervalPromiseArea = $interval(function() {
						console.log('intervalPromiseArea');
						loadAqiArea($scope.floor);
					}, 20000);
				};

				$scope.aqiTabChange = function(key) {
					console.log(key);
					switch (key) {
					case 'aqi':
						console.log("000000");
						$scope.selectTab($scope.tabIndexMachine, 'machine');
						break;
					case 'aqi-comparison':
						console.log("in case..");
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

		
				var loadData = function() {
					console.log("loaddata")
					AuthService.getTocken(function(token) {
						loadAqiMachine($scope.floor);
						loadAqiArea($scope.floor);
						loadAqiArea2($scope.floor);
					});
				};
				loadData();
				var loadAqiMachine = function(floor) {
					
					if (!$scope.aqiMachineData) {
						$scope.aqiMachineLoading = true;
						DashBoardService.getAvgMachineValues(floor, interval, function(res) {
							
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
						DashBoardService.getAvgMachineValues(floor, interval, function(res) {
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
								console.log("call!!!!!!!!!");
//								console.log( $scope.aqiAreaComparison[$scope.tabIndexAreaComparison].data.maxAqi.aqiValue);
//								loadGaugeChart('#aqi_area_comparison_chart_' + $scope.tabIndexAreaComparison, $scope.aqiAreaComparison[$scope.tabIndexAreaComparison].data.maxAqi.aqiValue);
								
//								if ($scope.aqiAreaComparisonLastWeek) {
//									loadGaugeChart('#aqi_area_comparison_chart_last_week_' + $scope.tabIndexAreaComparison, $scope.aqiAreaComparisonLastWeek[$scope.tabIndexAreaComparison].data.maxAqi.aqiValue);
//									$scope.aqiAreaComparison[$scope.tabIndexAreaComparison].data.maxAqiLastWeek = $scope.aqiAreaComparisonLastWeek[$scope.tabIndexAreaComparison].data.maxAqi;
//									
//								}

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
									
									if ($scope.aqiAreaComparison) {
										$scope.aqiAreaComparisonLastWeek = res[0].assets;
										
										console.log( $scope.aqiAreaComparison[$scope.tabIndexAreaComparison].data.maxAqi.aqiValue);
										loadGaugeChart('#aqi_area_comparison_chart_' + $scope.tabIndexAreaComparison, $scope.aqiAreaComparison[$scope.tabIndexAreaComparison].data.maxAqi.aqiValue);
										
										loadGaugeChart('#aqi_area_comparison_chart_last_week_' + $scope.tabIndexAreaComparison, $scope.aqiAreaComparisonLastWeek[$scope.tabIndexAreaComparison].data.maxAqi.aqiValue);
										$scope.aqiAreaComparison[$scope.tabIndexAreaComparison].data.maxAqiLastWeek = $scope.aqiAreaComparisonLastWeek[$scope.tabIndexAreaComparison].data.maxAqi;
										
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
									//console.log(lastTimeStamp);
									 console.log(timestamps);
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
				
				
				var loadAqiArea2= function(floor) {
					// console.log(!$scope.aqiMachineData);
					// console.log($scope.tabIndexMachine);
					if (!$scope.aqiAreaData2) {
						$scope.aqiAreaLoading2 = true;
						DashBoardService.getAqiAvgAreaValues(floor, interval, function(res) {
							if (res.length > 0) {
								$scope.aqiAreaData2 = res[0].assets;
								$("#aqi-area-tab-content2").fadeIn();
								$scope.selectTab($scope.tabIndexArea2, 'area2');
								if (!dynamicUpdateAreaStarted2) {
									startDynamicUpdateArea2();
									dynamicUpdateAreaStarted2 = true;
								}
							}
							$scope.aqiAreaLoading2 = false;
						});
					} else {
						DashBoardService.getAqiAvgAreaValues(floor, interval, function(res) {
							if (res.length > 0) {
								$scope.aqiAreaData2 = res[0].assets;
								// console.log($scope.tabIndexArea);
								$scope.selectTab($scope.tabIndexArea2, 'area2');
							}
						});
					}

				};
				
				var getAreaComponets = function(data) {
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
					if (type === 'comparison') {
						$scope.tabIndexAreaComparison = index;
						console.log($scope.tabIndexAreaComparison);
						if ($scope.aqiAreaComparison) {
							console.log("called! "+$scope.aqiAreaComparison[index].data.maxAqi.aqiValue);
							loadGaugeChart('#aqi_area_comparison_chart_' + index, $scope.aqiAreaComparison[index].data.maxAqi.aqiValue);
						}
						if ($scope.aqiAreaComparisonLastWeek) {
							loadGaugeChart('#aqi_area_comparison_chart_last_week_' + index, $scope.aqiAreaComparisonLastWeek[index].data.maxAqi.aqiValue);

						}
						if ($scope.aqiAreaComparisonLastWeek && $scope.aqiAreaComparison) {
							$scope.aqiAreaComparison[$scope.tabIndexAreaComparison].data.maxAqiLastWeek = $scope.aqiAreaComparisonLastWeek[$scope.tabIndexAreaComparison].data.maxAqi;
						}
					}else if (type === 'area') {
						$scope.tabIndexArea = index;
						$scope.aqiAreaData[index].data.status = getStatus2($scope.aqiAreaData[index].data.maxAqi.name, $scope.aqiAreaData[index].data.maxAqi.aqiValue);
						$('.graph_class').hide();
						$('.area_gauge_chart_base').hide();
						setTimeout(function() {
							$('.graph_class').fadeIn();
							loadValuesToGraph('#area_chart_' + index, DashBoardService.prettyMs($scope.aqiAreaData[index].data.timestamps), $scope.aqiAreaData[index].data.value, index);
							loadGaugeChart('#area_gauge_chart_' + index, $scope.aqiAreaData[index].data.maxAqi.aqiValue);
							$('.area_gauge_chart_base').fadeIn();

						}, 300);
					}
					else if(type==='area2'){
						
						$scope.tabIndexArea2 = index;
						
					
						$scope.aqiAreaData2[index].data.components = getAreaComponets($scope.aqiAreaData2[index].data.seperatedResult);
						$scope.aqiAreaData2[index].data.status = getStatus($scope.aqiAreaData2[index].data.maxAqi.name, $scope.aqiAreaData2[index].data.maxAqi.aqiValue);
						$scope.aqiAreaData2[index].data.NH3status = getStatus("NH3", $scope.aqiAreaData2[index].data.components.NH3);
						$scope.aqiAreaData2[index].data.PM10status = getStatus("PM10", $scope.aqiAreaData2[index].data.components.PM10);
						$scope.aqiAreaData2[index].data.CO2status = getStatus("CO2", $scope.aqiAreaData2[index].data.components.CO2);
						$scope.aqiAreaData2[index].data.PBstatus = getStatus("PB", $scope.aqiAreaData2[index].data.components.PB);
						$scope.aqiAreaData2[index].data.O3status = getStatus("O3", $scope.aqiAreaData2[index].data.components.O3);
						
						
						
					}
					else if (type === 'machine') {
						$scope.tabIndexMachine = index;
						// Hard coded Image Urls

						// images/machine.jpg
						// images/wave_soldering_machine.png
						// images/soltech_machine (1).png
						// images/reflow_oven.png
						console.log("1111111");
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
						//$scope.getStat= function(name,value){$scope.gstatus=getStatus(name,value);};
						
						$scope.aqiMachineData[index].data.NH3status = getStatus("NH3", $scope.aqiMachineData[index].data.components.NH3);
						$scope.aqiMachineData[index].data.PM10status = getStatus("PM10", $scope.aqiMachineData[index].data.components.PM10);
						$scope.aqiMachineData[index].data.PM2_5status = getStatus("PM2_5", $scope.aqiMachineData[index].data.components.PM2_5);
						$scope.aqiMachineData[index].data.CO2status = getStatus("CO2", $scope.aqiMachineData[index].data.components.CO2);
						$scope.aqiMachineData[index].data.PBstatus = getStatus("PB", $scope.aqiMachineData[index].data.components.PB);
						$scope.aqiMachineData[index].data.SO2status = getStatus("SO2", $scope.aqiMachineData[index].data.components.SO2);
						$scope.aqiMachineData[index].data.NO2status = getStatus("NO2", $scope.aqiMachineData[index].data.components.NO2);
						$scope.aqiMachineData[index].data.O3status = getStatus("O3", $scope.aqiMachineData[index].data.components.O3);
						
						// console.log($scope.aqiMachineData[index].data);
						console.log(222222);

						// console.log(">> " + $scope.tabIndexMachine);
					} 

				};
				var graphColor = '#00acec';

				var loadGaugeChart = function(id, value) {
					console.log("id=="+id);
					console.log("inside loadgaugechart !!!!!");
					console.log(value);
					loadChart(id, 0, 500, value);
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
					console.log("inside load chart....");
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

				$scope.getFaArrowClass = function(gasStatus){
					
					if (gasStatus == ("Good")||gasStatus==("Satisfactory"))
                        return "fa-arrow-down";
                    else if (gasStatus == ("Moderate"))
                        return "fa-arrow-up";
                    else if (gasStatus == ("Poor")||gasStatus == ("Very Poor")||gasStatus==("Severe"))
                        return "fa-arrow-up";
				};
				
				$scope.getArrowClass = function(gasStatus){
					if (gasStatus == ("Good")||gasStatus==("Satisfactory"))
                        return "mahine_up_arrow";
                    else if (gasStatus == ("Moderate"))
                        return "mahine_down_arrow_mod";
                    else if (gasStatus == ("Poor")||gasStatus == ("Very Poor")||gasStatus==("Severe"))
                        return "mahine_down_arrow_warn";
				};
				
					
					$scope.getColorClass = function (gasStatus) {
						
	                    if (gasStatus == ("Good")||gasStatus==("Satisfactory"))
	                        return "machine_sat_green";
	                    else if (gasStatus == ("Moderate"))
	                        return "machine_mod_orange";
	                    else if (gasStatus == ("Poor")||gasStatus == ("Very Poor")||gasStatus==("Severe"))
	                        return "machine_warn_red";
	                };
	                

					
				
				
				var getStatus = function(prominentParameter, max) {
					var status = '';
					switch (prominentParameter) {
					case 'PM10':
						if (max >= 0 && max <= 50.99) {
							var status = 'Good';
						} else if (max >= 51 && max <= 100.99) {
							status = 'Satisfactory';

						} else if (max >= 101 && max <= 250.99) {
							status = 'Moderate';

						} else if (max >= 251 && max <= 350.99) {
							status = 'Poor';

						} else if (max >= 351 && max <= 430) {
							status = 'Very Poor';

						} else if (max > 430) {
							status = 'Severe';

						}

						break;
					case 'PM2_5':
						if (max >= 0 && max <= 30.99) {
							status = 'Good';
						} else if (max >= 31 && max <= 60.99) {
							status = 'Satisfactory';

						} else if (max >= 61 && max <= 90.99) {
							status = 'Moderate';

						} else if (max >= 91 && max <= 120.99) {
							status = 'Poor';

						} else if (max >= 121 && max <= 250) {
							status = 'Very Poor';

						} else if (max > 250) {
							status = 'Severe';

						}
						break;
					case 'NO2':
						if (max >= 0 && max <= 40.99) {
							status = 'Good';

						} else if (max >= 41 && max <= 80.99) {
							status = 'Satisfactory';

						} else if (max >= 81 && max <= 180.99) {
							status = 'Moderate';

						} else if (max >= 181 && max <= 280.99) {
							status = 'Poor';

						} else if (max >= 281 && max <= 400) {
							status = 'Very Poor';

						} else if (max > 400) {
							status = 'Severe';

						}
						break;
					case 'O3':
						if (max >= 0 && max <= 50.99) {
							status = 'Good';

						} else if (max >= 51 && max <= 100.99) {
							status = 'Satisfactory';

						} else if (max >= 101 && max <= 168.99) {
							status = 'Moderate';

						} else if (max >= 169 && max <= 208.99) {
							status = 'Poor';

						} else if (max >= 209 && max <= 748) {
							status = 'Very Poor';

						} else if (max > 748) {
							status = 'Severe';

						}
						//console.log(status);
						break;
					case 'CO2':
						if (max >= 0 && max <= 1.0) {
							status = 'Good';

						} else if (max >= 1.1 && max <= 2.09) {
							status = 'Satisfactory';

						} else if (max >= 2.1 && max <= 10.09) {
							status = 'Moderate';

						} else if (max >= 10.1 && max <= 17.09) {
							status = 'Poor';

						} else if (max >= 17.1 && max <= 34) {
							status = 'Very Poor';

						} else if (max > 34) {
							status = 'Severe';

						}
						break;
					case 'SO2':
						if (max >= 0 && max <= 40.99) {
							status = 'Good';

						} else if (max >= 41 && max <= 80.99) {
							status = 'Satisfactory';

						} else if (max >= 81 && max <= 380.99) {
							status = 'Moderate';

						} else if (max >= 381 && max <= 800.99) {
							status = 'Poor';

						} else if (max >= 801 && max <= 1600) {
							status = 'Very Poor';

						} else if (max > 1600) {
							status = 'Severe';

						}
						break;
					case 'NH3':
						if (max >= 0 && max <= 200.99) {
							status = 'Good';

						} else if (max >= 201 && max <= 400.99) {
							status = 'Satisfactory';

						} else if (max >= 401 && max <= 800.99) {
							status = 'Moderate';

						} else if (max >= 801 && max <= 1200.99) {
							status = 'Poor';

						} else if (max >= 801 && max <= 1200.99) {
							status = 'Poor';

						} else if (max >= 1201 && max <= 1800) {
							status = 'Very Poor';

						} else if (max > 1800) {
							status = 'Severe';

						}
						break;
					case 'PB':
						if (max >= 0 && max <= 0.59) {
							status = 'Good';

						} else if (max >= 0.6 && max <= 1.09) {
							status = 'Satisfactory';

						} else if (max >= 1.1 && max <= 2.09) {
							status = 'Moderate';

						} else if (max >= 2.1 && max <= 3.09) {
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
				//kiran and soumya
				var getStatus2 = function(prominentParameter, max) {
					var status = '';
					
					if (max >= 0 && max <= 50) {
						var status = 'Good';
					} else if (max > 50 && max <= 100) {
						status = 'Satisfactory';

					} else if (max > 100 && max <= 200) {
						status = 'Moderate';

					} else if (max > 200 && max <= 300) {
						status = 'Poor';

					} else if (max > 300 && max <= 400) {
						status = 'Very Poor';

					} else if (max > 400 && max <=500) {
						status = 'Severe';

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