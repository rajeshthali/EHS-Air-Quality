define([ 'angular', './controllers-module'], function(angular, controllers) {
	'use strict';
	controllers.controller('industrialHygiene', [ '$scope', '$http', '$state','NewhygnService', 'DashBoardService', 'AuthService', '$rootScope','$interval', '$stateParams', function($scope, $http, $state,NewhygnService, DashBoardService, AuthService, $rootScope,$interval,$stateParams) {
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
		
//		if (!$rootScope.floor) {
//			$rootScope.floor = 0;
//		}
		
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
//		$scope.floor = 0;
		$scope.tabIndex = 0;
		var promise = 0;
		$scope.hygieneLoading = false;
		var hygieneInterval = null;
		var interval = 1000 * 60 * 2;
		var intervalDynamic = 1000 * 30;
		
		$scope.floor =  $stateParams.floor;
		console.log("!!!! "+$stateParams.floor);
        if($stateParams.floor == null){
		   $scope.floor = 0;
		 console.log("undefined floor")
		}
		else{
		 $scope.floor =  $stateParams.floor;
	    console.log("changed floor in load data" +$scope.floor)
		}
		//Rohit
		$scope.changeFloor = function(floor) {
			if (!$scope.aqiMachineLoading && !$scope.aqiMachineLoading && !$scope.hygieneLoading) {
				$scope.loading = true;
				$scope.floor = floor;
				hygieneCharts = [];
				$rootScope.floor = floor;
				$scope.floor = floor;
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
					loadhygndata($rootScope.floor);
					
					
					//Rohit
					
					
				});
			};
			loadData();
			//Rohit
			var startDynamiUpdate = function() {
				//Rohit
				var interval = 1000 * 60 * 2;
				var intervalDynamic = 1000 * 30;
				
				console.log('running startDynamicUpdate..');
				promise = $interval(function() {
					loadHygiene($rootScope.floor);
				}, 20000);
			};
			
			
			var loadhygndata = function(floor) {
				
				//$scope.aqiMachineLoading = true;
				NewhygnService.getHygieneValues(floor, interval, function(res) {
					//console.log("res.length" +res.length);
					$scope.loading = false;
					if (res.length > 0) {
						$scope.hygnareaName = res[0].assets;
						$scope.asslen = $scope.hygnareaName.length;
					}
					
					
					
					for (var i = 0; i < $scope.asslen; i++) {
						avgHygiene = hygieneAvg(res[0].assets[i].data);
						$scope.floordata.push(avgHygiene);
						
						
					}
				});
				$scope.hygieneLoading = false;
			};
		
		
		
			var hygieneAvg = function(data) {
				var resObject = {
					humidity : 0.0,
					noise : 0.0,
					temperature : 0.0
				};
				for (var i = 0; i < data.length; i++) {
					resObject.humidity += data[i].humidity;
					resObject.noise += data[i].noise;
					resObject.temperature += data[i].temperature;
				}
				resObject.humidity = Number((resObject.humidity / data.length).toFixed(2));
				resObject.noise = Number((resObject.noise / data.length).toFixed(2));
				resObject.temperature = Number((resObject.temperature / data.length).toFixed(2));

				return resObject;
			};
		
		
			//Rohit
			var loadHygiene = function(floor) {
				
				//Rohit
				//$scope.hygieneLoading = true;
				
				var interval = 1000 * 60 * 2;
				var intervalDynamic = 1000 * 30;
				if (!$scope.hygieneData) {
					DashBoardService.getHygieneValues(floor, interval, function(res) {
						
                           if(res.length == 0){
                        	   $scope.selectTab($scope.tabIndex);
                        	   console.log("select tab: "+$scope.tabIndex);
                        	   startDynamiUpdate();
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
       						
       						$scope.selectTab($scope.tabIndex);
       						$scope.hygieneLoading = false;
                           }
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
   						   var series = getSeries($scope.tabIndex, data);
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
					name : 'Noise',
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
					name : 'humidity',
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
	}]);
});