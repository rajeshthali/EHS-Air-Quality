define([ 'angular', './controllers-module'], function(angular, controllers) {
	'use strict';
	controllers.controller('WasteManagementController', [ '$scope', '$http', '$state','NewhygnService', 'DashBoardService', 'WasteManagementService', 'AuthService', '$rootScope','$interval', function($scope, $http, $state,NewhygnService, DashBoardService, WasteManagementService, AuthService, $rootScope,$interval) {
		/*$('.loaderpg').css('display', 'block');
		$('.lad_img').css('display', 'block');*/
		$scope.loading = true;
	    $scope.floordata = [];
	    var avgWaste = null;
	    $scope.hygieneLoading = true;
	    //$scope.wasteTabList=['detailsGraph', 'guagedata'];
	    var intervalDynamic = 1000 * 30;
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
		//var hygieneCharts = [];
		var wasteCharts = [];
		$scope.wasteData = null;
		$scope.floor = 0;
		$scope.tabIndex = 0;
		var promise = 0;
		$scope.hygieneLoading = false;
		var hygieneInterval = null;
		var interval = 1000 * 60 ;
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
				wasteCharts = [];
				$rootScope.floor = floor;
				/*$scope.floor = floor;*/
				$scope.tabIndex = 0;
				$scope.hygieneLoading = false;
				$scope.wasteData = null;
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
					loadGuage($rootScope.floor);
					loadWaste($rootScope.floor);
					loadG($scope.oilValues, $scope.sValues, $scope.dValues);
					//startDynamiUpdate();
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
					loadGuage($rootScope.floor);
					loadWaste($rootScope.floor);
					
					}, 20000);
			};
			//Rohit
			var loadWaste = function(floor) {
				var interval = 1000 * 60 * 2;
				var intervalDynamic = 1000 * 30;
				//if (!$scope.wasteData) {
					WasteManagementService.getWasteConsumptionValues(floor, interval, function(res) {
						
						console.log("floor data: " +JSON.stringify(res));
						   if(res.length == 0){
							 // $scope.wasteData = res[0].assets;
							   $scope.selectTab($scope.tabIndex, $scope.oilValues, $scope.sValues, $scope.dValues);
							// loadG($scope.oilValues, $scope.sValues, $scope.dValues);
                        	  console.log("select tab: "+floor);
                           }
                           else{
                        	   $scope.wasteData = res[0].assets;
                        	   
                        	   console.log("waste data" +$scope.wasteData);
                        	   for (var i = 0; i < $scope.wasteData.length; i++) {
       							var asset = $scope.wasteData[i];
       							$scope.wasteData[i].usedOilValue = [];
       							$scope.wasteData[i].discardedContainersValue = [];
       							$scope.wasteData[i].solderDrossValue = [];
       							$scope.wasteData[i].timestamp = [];
       							for (var j = 0; j < asset.data.length; j++) {
       								$scope.wasteData[i].timestamp.push(asset.data[j].timestamp);
       								$scope.wasteData[i].usedOilValue.push(asset.data[j].usedOilValue);
       								$scope.wasteData[i].discardedContainersValue.push(asset.data[j].discardedContainersValue);
       								$scope.wasteData[i].solderDrossValue.push(asset.data[j].solderDrossValue);
       							}

       						}
       						$scope.hygieneLoading = false;
       					 $scope.selectTab($scope.tabIndex, $scope.oilValues, $scope.sValues, $scope.dValues);
       						//loadG($scope.oilValues, $scope.sValues, $scope.dValues);
       						//console.log("detailsgraph data" +$scope.wasteTabList[0]);
                           }
						
						// console.log($scope.hygieneData);

						
						
						//Rohit
						//console.log("graph " +$rootScope.floor);
						//$scope.options = loadGraph($rootScope.floor);
						
					   startDynamiUpdate();
					});
				/*}else {
					WasteManagementService.getWasteConsumptionValues(floor, intervalDynamic, function(res) {

						//$scope.data = res[0].assets;
						var data = res[0].assets;
						// console.log($scope.hygieneData);
						for (var i = 0; i < data.length; i++) {
							var asset = data[i];
							data.usedOilValue = [];
							data.discardedContainersValue = [];
							data.solderDrossValue = [];
							data.timestamp = [];
							for (var j = 0; j < asset.data.length; j++) {
								data.timestamp.push(asset.data[j].timestamp);
								data.usedOilValue.push(asset.data[j].usedOilValue);
								data.discardedContainersValue.push(asset.data[j].discardedContainersValue);
								data.solderDrossValue.push(asset.data[j].solderDrossValue);
							}
						   var maxIndex = getMaxIndex(data);
   						   var series = getSeries($scope.tabIndex, data);
						   var timestamps = WasteManagementService.prettyMs([ data.timestamp[maxIndex] ])[0];
							if (i < wasteCharts[$scope.tabIndex].series.length - 1) {
								var l = wasteCharts[$scope.tabIndex].series[0].data.length;
								if (l > 0) {
									var lastTimeStamp = wasteCharts[$scope.tabIndex].series[i].data[l - 1]['name'];
									if (!lastTimeStamp) {
										lastTimeStamp = wasteCharts[$scope.tabIndex].series[i].data[l - 1]['category'];
									}
									if (lastTimeStamp !== timestamps) {
										wasteCharts[$scope.tabIndex].series[i].addPoint([ timestamps, series[i].data[maxIndex] ], false, true);
										//console.log('adde to graph : ' + lastTimeStamp + '  ' + timestamps);
									} else {
										//console.log('Same time stamp : ' + lastTimeStamp + '  ' + timestamps);
									}
								}

							} else {
								var l = wasteCharts[$scope.tabIndex].series[0].data.length;
								if (l > 0) {
									var lastTimeStamp = wasteCharts[$scope.tabIndex].series[i].data[l - 1]['name'];
									if (!lastTimeStamp) {
										lastTimeStamp = wasteCharts[$scope.tabIndex].series[i].data[l - 1]['category'];
									}
									if (lastTimeStamp !== timestamps) {
										wasteCharts[$scope.tabIndex].series[i].addPoint([ timestamps, series[i].data[maxIndex] ], true, true);
										//console.log('adde to graph : ' + lastTimeStamp + '  ' + timestamps);
									} else {
										//console.log('Same time stamp : ' + lastTimeStamp + '  ' + timestamps);
									}
								}

							}

						}

					});
				}*/
			};
			
			var loadGuage = function(floor){
				WasteManagementService.getWasteConsumptionValues(floor, intervalDynamic, function(res) {
					console.log("floor="+floor);
				 if (res.length > 0) {
						$scope.wasteName = res[0].assets;
						
						console.log("avergay data" +$scope.wasteName);
						$scope.asslen = $scope.wasteName.length;
						console.log("avg asset length: " +$scope.asslen);
						}
				   else{
					   console.log("no data found");
				   }
				 var resObject = {
							usedOilValue : 0.0,
							discardedContainersValue : 0.0,
							solderDrossValue : 0.0
						};
				   for (var i = 0; i < 1; i++) {
				    
					   resObject.usedOilValue = oilWasteAvg(res[0].assets[i].data);
					   resObject.discardedContainersValue = discardedWasteAvg(res[0].assets[i+1].data);
					   resObject.solderDrossValue = solderWasteAvg(res[0].assets[i+2].data);
					   
					    
						$scope.floordata=[];
						$scope.floordata.push(resObject);
						console.log("pushed floor data" +JSON.stringify($scope.floordata));
				    }
				   $scope.floorLen = $scope.floordata.length;
				   
				   console.log("floor length" +$scope.floorLen);
				
				   
				   for(var i = 0; i <  $scope.floorLen; i++ ){
					   
					   $scope.oilValues = $scope.floordata[i].usedOilValue;
					   console.log("used oalues" + $scope.oilValues);
					   
					   $scope.sValues = $scope.floordata[i].discardedContainersValue;
					   console.log("used salues" +$scope.sValues);
					   
					   $scope.dValues = $scope.floordata[i].solderDrossValue;
					   console.log("used dalues" +$scope.dValues);
				   }
				  //$scope.floordata.removeAll();
				   $scope.selectTab($scope.tabIndex,  $scope.oilValues, $scope.sValues, $scope.dValues);
			});
		};
			var oilWasteAvg = function(data) {
	        	var resObject = {
					usedOilValue : 0.0
					
				};
				for (var i = 0; i < data.length; i++) {
					resObject.usedOilValue += data[i].usedOilValue;
					
				}
				resObject.usedOilValue = Number((resObject.usedOilValue / data.length).toFixed(2));
				 return resObject.usedOilValue;
				
			};
			var discardedWasteAvg = function(data) {
	        	var resObject = {
					discardedContainersValue : 0.0
				};
				for (var i = 0; i < data.length; i++) {
					resObject.discardedContainersValue += data[i].discardedContainersValue;
				}
				resObject.discardedContainersValue = Number((resObject.discardedContainersValue / data.length).toFixed(2));
				return resObject.discardedContainersValue;
				
			};
			var solderWasteAvg = function(data) {
	        	var resObject = {
					solderDrossValue : 0.0
				};
				for (var i = 0; i < data.length; i++) {
					resObject.solderDrossValue += data[i].solderDrossValue;
				}
				resObject.solderDrossValue = Number((resObject.solderDrossValue / data.length).toFixed(2));
				return resObject.solderDrossValue;
				
			};
		
		

			$scope.selectTab = function(index, oilValues, sValues, dValues) {
				  // console.log("select tab data" +JSON.stringify(res));
				  console.log("oil values" +oilValues);
				  console.log("solder values" +sValues);
				  console.log("discarded containers" +dValues);
				  
				   $scope.tabIndex = index;
				   console.log("select tab index is: " +$scope.tabIndex);
				   setTimeout(function() {
						   console.log("used oalues" + $scope.oilValues);
						   console.log("used salues" +$scope.sValues);
						   console.log("used dalues" +$scope.dValues);
					 
					   
							//for the details graph
					   		$scope.options = loadGraph(index);
							$scope.chartfunc2($scope.options, index); 
							
							//for the guage ahrt
							loadGaugeChart('#waste_gauge_chart_0' , oilValues);
						    loadGaugeChart('#waste_gauge_chart_1' , sValues);
						    loadGaugeChart('#waste_gauge_chart_2' , dValues);
				}, 100);
			  };
        
			  $scope.loadG = function(oilValues, sValues, dValues)
			  {
					loadGaugeChart('#waste_gauge_chart_0' , oilValues);
				    loadGaugeChart('#waste_gauge_chart_1' , sValues);
				    loadGaugeChart('#waste_gauge_chart_2' , dValues);
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
					data = $scope.wasteData[tabId];
				}
				series.push({
					name : 'Solder Dross',
					data : data.solderDrossValue,
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
					name : 'Used Oils',
					data : data.usedOilValue,
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
					name : 'Discarded Containers',
					data : data.discardedContainersValue,
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
						categories : WasteManagementService.prettyMs($scope.wasteData[index].timestamp),
						crosshair: true
					},
				    
				    yAxis: {

				            title: {
				                margin: 10,
				                text: 'Waste Values'
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
			  $scope.options.chart.renderTo = 'containerW_'+ tabIndex;
			  $scope.options.chart.type = 'areaspline';
			  var chart1 = new Highcharts.Chart($scope.options);
			};
		   $scope.chartfunc2 = function(options , index){
			  $(".charticon").addClass("active_chart");
			  $(".charticon1").removeClass("active_chart");
			  
			  console.log("tab index: " +$scope.options);
			  var bar = document.getElementById('column');
			  console.log("bar is called");
			  $scope.options.chart.renderTo = 'containerW_'+ index;
			  $scope.options.chart.type = 'column';
		      var chart1 = new Highcharts.Chart($scope.options);
	        };
				
				$scope.$on('$destroy', function() {
				$scope.stop();
			});

	}]);
});