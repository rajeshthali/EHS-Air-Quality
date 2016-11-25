define([ 'angular', './controllers-module'], function(angular, controllers) {
	'use strict';
	controllers.controller('EnergyManagementController', [ '$scope', '$http', '$state','NewhygnService', 'DashBoardService', 'EnergyManagementService', 'AuthService', '$rootScope','$interval', function($scope, $http, $state,NewhygnService, DashBoardService, EnergyManagementService, AuthService, $rootScope,$interval) {
		/*$('.loaderpg').css('display', 'block');
		$('.lad_img').css('display', 'block');*/
		$scope.loading = true;
	    $scope.floordata = [];
	    var avgEnergy = null;
	    $scope.hygieneLoading = true;
	    //$scope.wasteTabList=['detailsGraph', 'guagedata'];
	    
	    //var intervalDynamic = 1000 * 30;
		
	    
	    
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
		
		var interval = 30 * 1000;
		var refreshInterval = 20 * 1000;
		var intervalDynamic = 1000 * 30;
		
		//Rohit
		//var hygieneCharts = [];
		var energyCharts = [];
		$scope.energyData = null;
		$scope.floor = 0;
		$scope.tabIndex = 0;
		var promise = 0;
		$scope.hygieneLoading = false;
		var hygieneInterval = null;
		var interval = 1000 * 60 * 2;
		var intervalDynamic = 1000 * 30;
		var dynamicUpdateGraphStarted = false;
		
		$scope.changeFloor = function(floor) {
			if (!$scope.aqiMachineLoading && !$scope.aqiMachineLoading && !$scope.hygieneLoading) {
				$scope.loading = true;
				$scope.floor = floor;
				energyCharts = [];
				$rootScope.floor = floor;
				/*$scope.floor = floor;*/
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
		 var loadData = function(floor) {
			 $scope.floordata = [];
			 $scope.hygnareaName = null;
				$scope.hygieneLoading = true;
				AuthService.getTocken(function(token) {
					//loadEnergy($rootScope.floor);
					//loadguage($rootScope.floor);
					loadGuage($rootScope.floor);
					loadEnergy($rootScope.floor);
					startDynamiUpdateArea();
					//loadG();
				});
				
			};
			loadData();
			
			//Rohit
			/*var startDynamiUpdate = function() {
				//Rohit
				var interval = 1000 * 60 * 2;
				var intervalDynamic = 1000 * 30;
				
				console.log('running startDynamiUpdate..');
				promise = $interval(function() {
					loadGuage($rootScope.floor);
					//loadEnergy($rootScope.floor);
					}, 20000);
			};*/
			
			
			
			var startDynamiUpdateArea = function() {
				
				promise = $interval(function() {
					 console.log('intervalPromiseArea');
					 loadEnergy($rootScope.floor);
					 loadGuage($rootScope.floor);
				}, 20000);
			};
			/*var startDynamicUpdateArea2 = function() {
				
				intervalPromiseArea = $interval(function() {
					console.log('intervalPromiseArea');
					loadAqiArea($scope.floor);
				}, 20000);
			};*/
			//Rohit
			var loadEnergy = function(floor) {
				//if (!$scope.energyData) {
					EnergyManagementService.getEnergyConsumptionValues(floor, interval, function(res) {
						
						console.log("floor data: " +JSON.stringify(res));
						   if(res.length == 0){
							  $scope.energyData = res[0].assets;
							   $scope.selectTab($scope.tabIndex, $scope.smt1Values, $scope.smt2Values, $scope.pgFloorValues);
							  // loadG($scope.smt1Values, $scope.smt2Values, $scope.pgFloorValues);
                        	  // console.log("detailsgraph data" +$scope.wasteTabList[0]);
							  /* if(!dynamicUpdateGraphStarted){
								   startDynamiUpdateArea();
								   dynamicUpdateGraphStarted=true; 
									  }*/

                        	   console.log("select tab: "+floor);
                           }
                           else{
                        	   $scope.energyData = res[0].assets;
                        	   
                        	   console.log("energy data" +$scope.energyData);
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
       						//loadG($scope.smt1Values, $scope.smt2Values, $scope.pgFloorValues);
                           }
						   
					});
				/*}else {
					
					console.log("floor data: " +JSON.stringify(res));
					   if(res.length > 0){
						  $scope.energyData = res[0].assets;
						   $scope.selectTab($scope.tabIndex, $scope.smt1Values, $scope.smt2Values, $scope.pgFloorValues);
						 	   console.log("select tab: "+floor);
                       }
                       else{
                    	   $scope.energyData = res[0].assets;
                    	   
                    	   console.log("energy data" +$scope.energyData);
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
   						//loadG($scope.smt1Values, $scope.smt2Values, $scope.pgFloorValues);
                       }
					   //startDynamiUpdateArea();   
				}*/
			};
			
			var loadGuage = function(floor){
				EnergyManagementService.getEnergyConsumptionValues(floor, intervalDynamic, function(res) {
				 if (res.length > 0) {
						$scope.energyName = res[0].assets;
						console.log("avergae data" +$scope.energyName);
						$scope.asslen = $scope.energyName.length;
						console.log("avg asset length: " +$scope.asslen);
						}
				   else{
					   console.log("no data found");   
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
						console.log("pushed floor data" +JSON.stringify($scope.floordata));
				    }
				 
				 $scope.floorLen = $scope.floordata.length;
				
				 for(var i = 0; i <  $scope.floorLen; i++ ){
					   
					   $scope.pgFloorValues = $scope.floordata[i].pgFloorValues;
					   console.log("used oalues" + $scope.pgFloorValues);
					   
					   $scope.smt1Values = $scope.floordata[i].smt1Values;
					   console.log("used salues" +$scope.smt1Values);
					   
					   $scope.smt2Values = $scope.floordata[i].smt2Values;
					   console.log("used dalues" +$scope.smt2Values);
				   }
				 
		 
				   $scope.selectTab($scope.tabIndex, $scope.smt1Values, $scope.smt2Values, $scope.pgFloorValues);
			});
				 //startDynamiUpdateArea();
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
			$scope.selectTab = function(index, smt1Values, smt2Values, pgFloorValues) {
				  // console.log("select tab data" +JSON.stringify(res));
				/*  console.log("smt1 values" +smt1Values);
				  console.log("smt2 values" +smt2Values);
				  console.log("pg floor values" +pgFloorValues);*/
				  
				   $scope.tabIndex = index;
				   console.log("select tab index is: " +$scope.tabIndex);
				   
				   
				   setTimeout(function() {
						 /*  console.log("smt1 values" + $scope.smt1Values);
						   console.log("smt2 values" +$scope.smt2Values);
						   console.log("pg floor values" +$scope.pgFloorValues);
					 */
					   
							//for the details graph
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
		    	 console.log("welcome to guage" + $scope.gValues);
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
			  $scope.options.chart.renderTo = 'containerE_'+ tabIndex;
			  $scope.options.chart.type = 'areaspline';
			  var chart1 = new Highcharts.Chart($scope.options);
			};
		   $scope.chartfunc2 = function(options , index){
			  $(".charticon").addClass("active_chart");
			  $(".charticon1").removeClass("active_chart");
			  console.log("tab index: " +$scope.options);
			  var bar = document.getElementById('column');
			  console.log("bar is called");
			  $scope.options.chart.renderTo = 'containerE_'+ index;
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