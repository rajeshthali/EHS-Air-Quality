define([ 'angular', './controllers-module'], function(angular, controllers) {
	'use strict';
	controllers.controller('industrialHygiene', [ '$scope', '$http', '$state','NewhygnService', 'DashBoardService', 'AuthService', '$rootScope','$interval', '$stateParams', function($scope, $http, $state,NewhygnService, DashBoardService, AuthService, $rootScope,$interval,$stateParams) {
		$scope.loading = true;
		var avgHygiene = null;
		var chart1;
		$scope.floordata = [];
		$scope.hygieneLoading = true;
				
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
		
		
		
		$scope.hygieneData = null;
		$scope.tabIndex = 0;
		var promise = 0;
		$scope.hygieneLoading = false;
		var interval = 1000 * 60 * 2;
		
		$scope.floor =  $stateParams.floor;
        if($stateParams.floor == null){
		   $scope.floor = 0;
		}
		else{
		 $scope.floor =  $stateParams.floor;
		}
		
		$scope.changeFloor = function(floor) {
			if (!$scope.aqiMachineLoading && !$scope.hygieneLoading) {
				$scope.loading = true;
				$scope.floor = floor;
				$rootScope.floor = floor;
				$scope.floor = floor;
				$scope.tabIndex = 0;
				$scope.hygieneLoading = false;
				$scope.hygieneData = null;
				$scope.stop();
				
				loadData($rootScope.floor);
			}
		};
		
		
		
		$scope.$on('$destroy', function() {
			$scope.stop();
		});

		$scope.stop = function() {
			$interval.cancel(promise);
		};
		
		var startDynamiUpdate = function() {

			promise = $interval(function() {
				loadHygiene($rootScope.floor);
			}, 20000);
		};
		
		
		
			
			
			
			var loadhygndata = function(floor) {
				NewhygnService.getHygieneValues(floor, interval, function(res) {
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
		
		
			//Krishna
			var loadHygiene = function(floor) {
				
				DashBoardService.getHygieneValues(floor, interval, function(res) {
						
                           if(res.length == 0){
                        	   $scope.selectTab($scope.tabIndex);
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
					});
			};
			
			 var loadData = function(floor) {
				 $scope.floordata = [];
				 $scope.hygnareaName = null;
					$scope.hygieneLoading = true;
					AuthService.getTocken(function(token) {
						
						loadHygiene($rootScope.floor);
						loadhygndata($rootScope.floor);
						startDynamiUpdate();
						
					});
				};
				loadData();
				
			$scope.selectTab = function(index) {
				$scope.tabIndex = index;
				$('.hygiene_details_graph_class').hide();
			    setTimeout(function() {
						$('.hygiene_details_graph_class').fadeIn();
				          $scope.options = loadGraph(index);
     					  $scope.chartfunc2($scope.options ,index)	  
						  
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
			  $scope.options.chart.renderTo = 'containerH_'+ tabIndex;
			  $scope.options.chart.type = 'areaspline';
			  chart1 = new Highcharts.Chart($scope.options);
			 };
			
		   $scope.chartfunc2 = function(options , index){
			  $(".charticon").addClass("active_chart");
			  $(".charticon1").removeClass("active_chart");
			  $scope.options.chart.renderTo = 'containerH_'+ index;
			  $scope.options.chart.type = 'column';
		      chart1 = new Highcharts.Chart($scope.options);
	          };
				
				$scope.$on('$destroy', function() {
				$scope.stop();
			});
	}]);
});