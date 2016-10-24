define([ 'angular', './controllers-module'], function(angular, controllers) {
	'use strict';
	controllers.controller('EnergyManagementController', [ '$scope', '$http', '$state','NewhygnService', 'DashBoardService', 'AuthService', '$rootScope','$interval', function($scope, $http, $state,NewhygnService, DashBoardService, AuthService, $rootScope,$interval) {
		/*$('.loaderpg').css('display', 'block');
		$('.lad_img').css('display', 'block');*/
		$scope.loading = true;
		var avgHygiene = null;
		var floorArray = [];
		$scope.floordata = [];
		var maxFloor = 3;
		var maxOpacity = .99;
		var interval = 25 * 1000;
		$scope.hygieneLoading = true;
		
		if (!$rootScope.floor) {
			$rootScope.floor = 0;
		}
		
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
		var hygieneCharts = [];
		$scope.hygieneData = null;
		$scope.floor = 0;
		$scope.tabIndex = 0;
		var promise = 0;
		$scope.hygieneLoading = false;
		var hygieneInterval = null;
		var interval = 1000 * 60 * 2;
		var intervalDynamic = 1000 * 30;
		
		/*$scope.changeFloor = function(floor) {
			if (!$scope.hygieneLoading) {
				$scope.loading = true;
				
				//Rohit
				hygieneCharts = [];
				$scope.stop();
			
				$rootScope.floor = floor;
				//Rohit
				console.log("floor no. " +$rootScope.floor);
				$scope.tabIndex = 0;
				
				$scope.hygieneLoading = false;
				
			    //Rohit
				$scope.hygieneData = null;
				loadData($rootScope.floor);
			}
		};*/
		
		$scope.changeFloor = function(floor) {
			if (!$scope.aqiMachineLoading && !$scope.aqiMachineLoading && !$scope.hygieneLoading) {
				$scope.loading = true;
				$scope.floor = floor;
				hygieneCharts = [];
				$rootScope.floor = floor;
				/*$scope.floor = floor;*/
				$scope.tabIndex = 0;
				$scope.hygieneLoading = false;
				$scope.hygieneData = null;
				$scope.stop();
				
				loadData($rootScope.floor);
			}
		};
		
		
		//Rohit
		$scope.$on('$destroy', function() {
			$scope.stop();
		});

		$scope.stop = function() {
			$interval.cancel(promise);
		};
		 var loadData = function(floor) {
			 $scope.floordata = [];
			 $scope.hygnareaName = null;
				$scope.hygieneLoading = true;
				AuthService.getTocken(function(token) {
					loadHygiene($rootScope.floor);
				});
			};
			loadData();
			//Rohit
			var startDynamiUpdate = function() {
				//Rohit
				var interval = 1000 * 60 * 2;
				var intervalDynamic = 1000 * 30;
				
				console.log('running startDynamiUpdate..');
				promise = $interval(function() {
					loadHygiene($rootScope.floor);
				}, 20000);
			};
			//Rohit
			var loadHygiene = function(floor) {
				var interval = 1000 * 60 * 2;
				var intervalDynamic = 1000 * 30;
				if (!$scope.hygieneData) {
					DashBoardService.getHygieneValues(floor, interval, function(res) {
						
                           if(res.length == 0){
                        	   $scope.selectTab($rootScope.floor);
                        	   console.log("select tab: "+$rootScope.floor);
                           }
                           else{
                        	   $scope.hygieneData = res[0].assets;
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
       						$scope.selectTab($scope.tabIndex);
                           }
						
						// console.log($scope.hygieneData);

						
						
						//Rohit
						//console.log("graph " +$rootScope.floor);
						//$scope.options = loadGraph($rootScope.floor);
						
					   startDynamiUpdate();
					});
				} else {
					DashBoardService.getHygieneValues(floor, intervalDynamic, function(res) {

						//$scope.data = res[0].assets;
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
			$scope.selectTab = function(index) {
				$scope.tabIndex = index;
			    console.log("select tab index is: " +$scope.tabIndex)
				setTimeout(function() {
				    $scope.options = loadGraph(index);
				    $scope.chartfunc2($scope.options, index);
				    $scope.value = 50 ;
				    $scope.value1 = 80 ;
				    $scope.value2 =30 ;
				    
				    console.log("guage value is: " +$scope.value);
				    loadGaugeChart('#waste_gauge_chart_0' , $scope.value);
				    loadGaugeChart('#waste_gauge_chart_1' , $scope.value1);
				    loadGaugeChart('#waste_gauge_chart_2' , $scope.value2);
				 }, 300);
		     };

		
		     //waste_mgmnt_Rohit
		     var loadGaugeChart = function(id, value) {
					loadChart(id, 0, 200, value);
				};
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
		     
		     
		     
			
			var getSeries = function(tabId, dataArg) {
				var colors = [ '#8769FF', '#27A9E3', '#28B779', '#ff9000', '#8bd6f6', '#8669ff', '#28b779' ];
				var series = [];
				var data = null;
				if (dataArg) {
					data = dataArg;
				} else {
					data = $scope.hygieneData[tabId];
				}
				series.push({
					name : 'SMT Line1',
					data : data.noise,
					color : colors[1],
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
					name : 'SMT Line2',
					data : data.humidity,
					color : colors[0],
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
					name : 'Production Ground Floor',
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
				
				$scope.$on('$destroy', function() {
				$scope.stop();
			});

			
			
			
	

		/*$scope.gotoDetailsView = function() {
			$state.go('hygiene-details');
		};*/

	}]);
});