define([ 'angular', './controllers-module'], function(angular, controllers) {
	'use strict';
	controllers.controller('EnergyManagementController', [ '$scope', '$http', '$state','NewhygnService', 'DashBoardService', 'EnergyManagementService', 'AuthService', '$rootScope','$interval', function($scope, $http, $state,NewhygnService, DashBoardService, EnergyManagementService, AuthService, $rootScope,$interval) {
		$scope.loading = true;
	    $scope.floordata = []; 
	    $scope.hygieneLoading = true;
	    var chart,chart1;
		  var data = null;
	    
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
		$scope.energyData = null;
		$scope.floor = 0;
		$scope.tabIndex = 0;
		var promise = 0;
		$scope.hygieneLoading = false;
		var interval = 1000 * 60 * 2;
		var intervalDynamic = 1000 * 30;
		
		$scope.changeFloor = function(floor) {
			if (!$scope.aqiMachineLoading && !$scope.hygieneLoading) {
				$scope.loading = true;
				$scope.floor = floor;
				$rootScope.floor = floor;
				$scope.tabIndex = 0;
				$scope.hygieneLoading = false;
				$scope.energyData = null;
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
		
		//Rohit
		var loadEnergy = function(floor) {
				EnergyManagementService.getEnergyConsumptionValues(floor, interval, function(res) {
					   if(res.length == 0){
						  $scope.energyData = res[0].assets;
						   $scope.selectTab($scope.tabIndex, $scope.smt1Values, $scope.smt2Values, $scope.pgFloorValues);

                       }
                       else{
                    	   $scope.energyData = res[0].assets;
                    	   
                    	   for (var i = 0; i < $scope.energyData.length; i++) {
   							var asset = $scope.energyData[i];
   							$scope.energyData[i].smtLine1EnergyValue = [];
   							$scope.energyData[i].smtLine2EnergyValue = [];
   							$scope.energyData[i].productionGroundFloorEnergyValue = [];
   							$scope.energyData[i].timestamp = [];
   							for (var j = 0; j < asset.data.length; j++) {
   								$scope.energyData[i].timestamp.push(asset.data[j].timestamp);
   								$scope.energyData[i].smtLine1EnergyValue.push(asset.data[j].smtLine1EnergyValue);
   								$scope.energyData[i].smtLine2EnergyValue.push(asset.data[j].smtLine2EnergyValue);
   								$scope.energyData[i].productionGroundFloorEnergyValue.push(asset.data[j].productionGroundFloorEnergyValue);
   							}
   						 

   						}
                    	   
   						$scope.hygieneLoading = false;
   						$scope.selectTab($scope.tabIndex,$scope.smt1Values, $scope.smt2Values, $scope.pgFloorValues);
                       }
					   
				});
		};
		
		var loadGuage = function(floor){
			EnergyManagementService.getEnergyConsumptionValues(floor, intervalDynamic, function(res) {
			 if (res.length > 0) {
					$scope.energyName = res[0].assets;
					$scope.asslen = $scope.energyName.length;
					}
			  
			 var resObject = {
					 pgFloorValues : 0.0,
					 smt1Values : 0.0,
					 smt2Values : 0.0
					};
			 
			 for (var i = 0; i < 1; i++) {
				    
				   resObject.pgFloorValues = pgFloorValuesAvg(res[0].assets[i].data);
				   resObject.smt1Values = smt1ValuesAvg(res[0].assets[i+1].data);
				   resObject.smt2Values = smt2ValuesAvg(res[0].assets[i+2].data);
				   
				    
					$scope.floordata=[];
					$scope.floordata.push(resObject);
			    }
			 
			 $scope.floorLen = $scope.floordata.length;
			
			 for(var j = 0; j <  $scope.floorLen; j++ ){
				   
				   $scope.pgFloorValues = $scope.floordata[j].pgFloorValues;
				   
				   $scope.smt1Values = $scope.floordata[j].smt1Values;
				   
				   $scope.smt2Values = $scope.floordata[j].smt2Values;
			   }
			 
	 
			   $scope.selectTab($scope.tabIndex, $scope.smt1Values, $scope.smt2Values, $scope.pgFloorValues);
		});
			
	};
		var smt1ValuesAvg = function(data) {
        	var resObject = {
        		smtLine1EnergyValue : 0.0,
			};
			for (var i = 0; i < data.length; i++) {
				resObject.smtLine1EnergyValue += data[i].smtLine1EnergyValue;
			}
			return resObject.smtLine1EnergyValue;		
		};
	
		var smt2ValuesAvg = function(data) {
        	var resObject = {

        		smtLine2EnergyValue : 0.0,

			};
			for (var i = 0; i < data.length; i++) {

				resObject.smtLine2EnergyValue += data[i].smtLine2EnergyValue;

			}

			return resObject.smtLine2EnergyValue;
			
		};
		
		var pgFloorValuesAvg = function(data) {
        	var resObject = {
        	
        	productionGroundFloorEnergyValue : 0.0
			};
			for (var i = 0; i < data.length; i++) {
				resObject.productionGroundFloorEnergyValue += data[i].productionGroundFloorEnergyValue;
			}

			return resObject.productionGroundFloorEnergyValue;
			
		};
		
		var startDynamiUpdateArea = function() {
			
			promise = $interval(function() {
				 loadEnergy($rootScope.floor);
				 loadGuage($rootScope.floor);
			}, 20000);
		};
		
			
			
			
			
			 var loadData = function(floor) {
				 $scope.floordata = [];
				 $scope.hygnareaName = null;
					$scope.hygieneLoading = true;
					AuthService.getTocken(function(token) {
						loadGuage($rootScope.floor);
						loadEnergy($rootScope.floor);
						startDynamiUpdateArea();
					});
					
				};
				loadData();
				
			$scope.selectTab = function(index, smt1Values, smt2Values, pgFloorValues) {
				  
				   $scope.tabIndex = index;			   
				   
				   setTimeout(function() {
					   		$scope.options = loadGraph(index);
							$scope.chartfunc2($scope.options, index); 
							
							//for the guage ahrt
							loadGaugeChart('#waste_gauge_chart_0' , smt1Values);
						    loadGaugeChart('#waste_gauge_chart_1' , smt2Values);
						    loadGaugeChart('#waste_gauge_chart_2' , pgFloorValues);
				}, 100);
			  };

		
			  $scope.loadG = function(smt1Values, smt2Values, pgFloorValues)
			  {
				  loadGaugeChart('#waste_gauge_chart_0' , smt1Values);
				    loadGaugeChart('#waste_gauge_chart_1' , smt2Values);
				    loadGaugeChart('#waste_gauge_chart_2' , pgFloorValues);
			  };
		     //waste_mgmnt_Rohit
		     var loadGaugeChart = function(id, value) {
		    	 $scope.gValues = value;
					loadChart(id, 0, 200, value);
				};
				
		     var loadChart = function(selector, min, max, val) {
					var per = (val / max);
					 chart = c3.generate({
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
				if (dataArg) {
					data = dataArg;
				} else {
					data = $scope.energyData[tabId];
				}
				series.push({
					name : 'SMT Line 1',
					data : data.smtLine1EnergyValue,
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
					name : 'SMT Line 2',
					data : data.smtLine2EnergyValue,
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
					data : data.productionGroundFloorEnergyValue,
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
						categories : EnergyManagementService.prettyMs($scope.energyData[index].timestamp),
						crosshair: true
					},
				    
				    yAxis: {

				            title: {
				                margin: 10,
				                text: 'Energy Values'
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
				                enabled: false
				            }
				          },
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
			  $scope.options.chart.renderTo = 'containerE_'+ tabIndex;
			  $scope.options.chart.type = 'areaspline';
			  chart1 = new Highcharts.Chart($scope.options);
			};
		   $scope.chartfunc2 = function(options , index){
			  $(".charticon").addClass("active_chart");
			  $(".charticon1").removeClass("active_chart");
			  $scope.options.chart.renderTo = 'containerE_'+ index;
			  $scope.options.chart.type = 'column';
		      chart1 = new Highcharts.Chart($scope.options);
	        };
				
				$scope.$on('$destroy', function() {
				$scope.stop();
			});

	}]);
});