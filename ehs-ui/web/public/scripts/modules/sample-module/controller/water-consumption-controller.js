define(['angular', './controllers-module'], function(angular, controllers) {
    'use strict';
    controllers.controller('WaterConsumptionController', ['$scope', '$http', '$state' /*, '$log', 'PredixAssetService', 'PredixViewService', 'CalculationOneService', 'CalculationService'*/ , '$interval' /*, 'AqiService'*/ , '$rootScope', 'AuthService' /*, 'HygieneService'*/ , 'WaterConsumptionService',
        function($scope, $http, $state, $interval, $rootScope, AuthService, WaterConsumptionService) {
    	//Test
            var isLoading = false;
            var promise = 0;
            var initVariables = function() {
                $scope.waterTabList = ['pH Value', 'Suspended Solids', 'BOD', 'COD', 'Oil & Grease'];
                $scope.waterAssetTabList = ['Industrial Use', 'Domestic Use']
                $scope.waterTabEnableList = [true, false, false, false, false, false, false, false];
                $scope.maxValuepH = 6;
                $scope.maxValuesuspendedSolids = 100;
                $scope.maxValuebod = 30;
                $scope.maxValuecod = 250;
                $scope.maxValueoilGrease = 10;
                $scope.waterAreaLoading = true;
                $scope.waterAreaComparisonLoading = true;
                $scope.waterLoading = true;
                $scope.waterAreaData = null;
                $scope.waterAreaComparison = null;
                $scope.waterMachineData = null;
                $scope.tabIndexArea = 0;
                $scope.tabIndex = 0;
                $scope.pH = null;
                $scope.suspendedSolids = null;
                $scope.bod = null;
                $scope.cod = null;
                $scope.kld=null;
                $scope.oilGrease = null;
                $scope.tabIndexMachine = 0;
                $scope.tabIndexAreaComparison = 0;
                $scope.tabIndexMachineComparison = 0;
                $scope.waterAreaComparisonLastWeek = null;

            };
            initVariables();
            $scope.floors = [{
                name: 'F1',
                id: 0
            }, {
                name: 'F2',
                id: 1
            }, {
                name: 'F3',
                id: 2
            }];

            var interval = 3 * 50 * 1000;

           // $scope.floor = 0;
           /* $scope.changeFloor = function(floor) {
            	if (!$scope.waterLoading)
                    $scope.floor = floor;
                    $scope.tabIndex = 0;
                    $scope.water1Loading = false;
                    $scope.waterData = null;
                    $scope.stop();
                    initVariables();
                    loadData();
            		
            };*/
            
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
                	loadPollutants($scope.floor);
                    loadWaterAreaKld($scope.floor);
                   loadWaterkld($scope.floor);
                   loadWaterAllComponents($scope.floor);

                }, 20000);
            };

          var startDynamicUpdateArea = function() {
                intervalPromiseArea = $interval(function() {
                	 loadPollutants($scope.floor);
                     loadWaterAreaKld($scope.floor);
                     loadWaterkld($scope.floor);
                    loadWaterAllComponents($scope.floor);
                }, 20000);
            };

            var startDynamiUpdate = function() {
                console.log('running startDynamiUpdate..');
                promise = $interval(function() {
                	loadPollutants($scope.floor);
                    loadWaterAreaKld($scope.floor);
                    loadWaterkld($scope.floor);
                    loadWaterAllComponents($scope.floor);
                    loadWaterAreaAllComponents($scope.floor);

                }, 20000);
            };

            var loadData = function() {
                AuthService.getTocken(function(token) {
                    loadPollutants($scope.floor);
                    loadWaterAreaKld($scope.floor);
                    loadWaterkld($scope.floor);

                    loadWaterAllComponents($scope.floor);
                    loadWaterAreaAllComponents($scope.floor);
                    $scope.selectTab($scope.tabIndex, 'industrial');
                    $scope.selectTab($scope.tabIndex, 'domestic');
                    startDynamiUpdate();
                });
            };
            loadData();


            $scope.selectTab1 = function(index) {
                $scope.tabIndex = index;
                $('.water_details_graph_class').hide();
                console.log("select tab index is: " + $scope.tabIndex)
                setTimeout(function() {
                    $('.water_details_graph_class').fadeIn();
                   // if($scope.tabIndex)
                    loadGraphArea2($scope.waterDataList, $scope.tabIndex);
                }, 300);
            };

            $scope.selectTab2 = function(index) {
                $scope.tabIndex = index;
                $('.water_details_graph_class').hide();
                console.log("select tab index is: " + $scope.tabIndex)
                setTimeout(function() {
                    $('.water_details_graph_class').fadeIn();
                   // if($scope.tabIndex)
                    loadGraphArea3($scope.waterDataList, $scope.tabIndex);
                }, 300);
            };

            var loadWaterkld = function(floor) {
                WaterConsumptionService.getWaterValues(floor, interval, function(res) {
                	$scope.waterLoading = false;
                    $scope.waterDataList = angular.copy(res);
                    console.log("select tab index is: " + $scope.tabIndex)
                    setTimeout(function() {
                        loadGraphArea1($scope.waterDataList, $scope.tabIndex);
                        $scope.waterLoading = false;
                    }, 300);

                });
            };

            var loadWaterAllComponents = function(floor) {
                WaterConsumptionService.getWaterValues(floor, interval, function(res) {
                	$scope.waterLoading = false;
                    $scope.waterDataList = angular.copy(res);
                    console.log("select tab index is: " + $scope.tabIndex)
                    setTimeout(function() {
                    	if($scope.tabIndex == 0)
                    		{
                        loadGraphArea2($scope.waterDataList, $scope.tabIndex);
                    		}
                    	else
                    		{
                    		loadGraphArea3($scope.waterDataList, $scope.tabIndex);
                    		}
                        $scope.waterLoading = false;
                    }, 300);

                });
            };


            var loadPollutants = function(floor) {
                if (!$scope.waterMachineData) {
                    $scope.waterLoading = true;
                    WaterConsumptionService.getWaterConsumptionValues(floor, interval, function(res) {
                        if (res.length > 0) {
                            $scope.waterMachineData = res[0].assets;
                            $("#domestic-effluent-tab-content").fadeIn();
                            loadInitialCo($scope.tabIndex);

                            if (!dynamicUpdateMachineStarted) {
                                startDynamicUpdateMachine();
                            	/*startDynamicUpdate();*/
                                dynamicUpdateMachineStarted = true;
                            }
                        }
                        $scope.waterLoading = false;
                    });
                } else {
                    WaterConsumptionService.getWaterConsumptionValues(floor, interval, function(res) {
                        if (res.length > 0) {
                            $scope.waterMachineData = res[0].assets;
                        }
                    });
                }

            };


            var loadInitialCo = function(index) {
                $scope.pH = ($scope.waterMachineData[index].data[index].pHValue);
                $scope.suspendedSolids = ($scope.waterMachineData[index].data[index].suspendedSolids);
                $scope.bod = ($scope.waterMachineData[index].data[index].bod);
                $scope.cod = ($scope.waterMachineData[index].data[index].cod);
                $scope.oilGrease = ($scope.waterMachineData[index].data[index].oilGrease);
                $scope.kld1 = ($scope.waterMachineData[index].data[index].kld);
            };


            $scope.waterTabChange = function(key) {
                console.log(key);
                switch (key) {
                    case 'industrial':
                        $scope.selectTab(0, 'industrial');
                        break;
                    case 'domestic':
                        $scope.selectTab(1, 'domestic');
                        break;

                    default:
                        break;
                }
            };
            var loadWaterAreaKld = function(floor) {
                if (!$scope.waterAreaData) {
                    $scope.waterLoading = true;
                    $scope.waterAreaComparisonLoading = true;
                    WaterConsumptionService.getWaterAreaValues(floor, interval, function(res) {
                        if (res.length > 0) {

                            $scope.waterAreaData = res[0].assets;
                            $("#water-area-tab-content").fadeIn();
                            if (!dynamicUpdateAreaStarted) {
                                startDynamicUpdateArea();
                            	/*startDynamicUpdate();*/
                                dynamicUpdateAreaStarted = true;
                            }
                        }
                        $scope.waterLoading = false;
                        $scope.waterAreaComparisonLoading = false;
                    });

                } else {
                    WaterConsumptionService.getWaterAreaValues(floor, interval, function(res) {
                        if (res.length > 0) {
                            $scope.waterAreaData = res[0].assets;
                            $scope.waterAreaLoading = false;

                        }
                    });
                }

            };

            var loadWaterAreaAllComponents = function(floor) {
                if (!$scope.waterAreaData) {
                    $scope.waterAreaLoading = false;
                    $scope.waterLoading = true;
                    $scope.waterAreaComparisonLoading = true;
                    WaterConsumptionService.getWaterAreaValues(floor, interval, function(res) {
                        if (res.length > 0) {
                            $("#container").fadeIn();
                            $scope.selectTab1($scope.tabIndex);
                        }
                        $scope.waterLoading = false;
                        $scope.waterAreaComparisonLoading = false;
                    });

                } else {
                    WaterConsumptionService.getWaterAreaValues(floor, interval, function(res) {
                        if (res.length > 0) {
                            $scope.waterAreaLoading = false;
                            $scope.selectTab1($scope.tabIndex);
                        }
                    });
                }

            };


            var loadGraphArea1 = function(waterDataList, index) {
                for (var i = 0; i < waterDataList.length; i++) {

                    var waterDataValues = waterDataList[0].assets[i].data;

                    var dataXaxis = [];
                    var dataYaxis = [];
                    for (var j = 0; j < waterDataValues.length; j++) {
                        if ($scope.waterAssetTabList[index] == 'Industrial Use') {
                            var waterDataValues = waterDataList[0].assets[1].data;
                            dataYaxis.push(waterDataValues[j].kld);
                        } else if ($scope.waterAssetTabList[index] == 'Domestic Use') {
                            var waterDataValues = waterDataList[0].assets[0].data;
                            dataYaxis.push(waterDataValues[j].kld);
                        }

                        dataXaxis.push(waterDataValues[j].timestamp);
                        
                        $scope.pH = waterDataValues[j].pHValue;
                        $scope.suspendedSolids = waterDataValues[j].suspendedSolids;
                        $scope.bod = waterDataValues[j].bod;
                        $scope.cod = waterDataValues[j].cod;
                        $scope.oilGrease = waterDataValues[j].oilGrease
                        
                        $scope.kld1=waterDataValues[j].kld;

                        

                    }
                    for (var index = 0; index < $scope.waterAssetTabList.length; index++) {

                        loadValuesToGraphAreaKld('#area_chart_water_' + index, convertTimeStamps(dataXaxis), dataYaxis, $scope.waterAssetTabList[index]);
                    }

                }
            };

            var loadGraphArea2 = function(waterDataList, index) {
                for (var i = waterDataList.length; i >= 0; i--) {

                    var waterDataValues = waterDataList[0].assets[1].data;
                    var dataXaxis = [];
                    var dataYaxis = [];

                    for (var j = 0; j < waterDataValues.length; j++) {
                        if ($scope.waterAssetTabList[0] == 'Industrial Use') {
                            if ($scope.waterTabList[index] == 'pH Value') {
                                dataYaxis.push(waterDataValues[j].pHValue);

                            } else if ($scope.waterTabList[index] == 'Suspended Solids') {
                                dataYaxis.push(waterDataValues[j].suspendedSolids);

                            } else if ($scope.waterTabList[index] == 'BOD') {
                                dataYaxis.push(waterDataValues[j].bod);

                            } else if ($scope.waterTabList[index] == 'COD') {
                                dataYaxis.push(waterDataValues[j].cod);

                            } else if ($scope.waterTabList[index] == 'Oil & Grease') {
                                dataYaxis.push(waterDataValues[j].oilGrease);

                            }

                        } 
                        dataXaxis.push(waterDataValues[j].timestamp);
                        
                        $scope.pH = waterDataValues[j].pHValue;
                        $scope.suspendedSolids = waterDataValues[j].suspendedSolids;
                        $scope.bod = waterDataValues[j].bod;
                        $scope.cod = waterDataValues[j].cod;
                        $scope.oilGrease = waterDataValues[j].oilGrease
                        
                        $scope.kld1=waterDataValues[j].kld;

                    }
                    $scope.time = angular.copy(dataXaxis);
                    $scope.dataY = angular.copy(dataYaxis);
                    $scope.chartfunc2('industrial');
                }
            };

            var loadGraphArea3 = function(waterDataList, index) {
                for (var i = waterDataList.length; i >= 0; i--) {

                    var waterDataValues = waterDataList[0].assets[0].data;
                    var dataXaxis = [];
                    var dataYaxis = [];

                    for (var j = 0; j < waterDataValues.length; j++) {
                    		if ($scope.waterAssetTabList[1] == 'Domestic Use') {
                            if ($scope.waterTabList[index] == 'pH Value') {
                                dataYaxis.push(waterDataValues[j].pHValue);

                            } else if ($scope.waterTabList[index] == 'Suspended Solids') {
                                dataYaxis.push(waterDataValues[j].suspendedSolids);

                            } else if ($scope.waterTabList[index] == 'BOD') {
                                dataYaxis.push(waterDataValues[j].bod);

                            } else if ($scope.waterTabList[index] == 'COD') {
                                dataYaxis.push(waterDataValues[j].cod);

                            } else if ($scope.waterTabList[index] == 'Oil & Grease') {
                                dataYaxis.push(waterDataValues[j].oilGrease);

                            }
                        }

                        dataXaxis.push(waterDataValues[j].timestamp);
                        $scope.pH = waterDataValues[j].pHValue;
                        $scope.suspendedSolids = waterDataValues[j].suspendedSolids;
                        $scope.bod = waterDataValues[j].bod;
                        $scope.cod = waterDataValues[j].cod;
                        $scope.oilGrease = waterDataValues[j].oilGrease
                        
                        $scope.kld1=waterDataValues[j].kld;
                    }
                    $scope.time = angular.copy(dataXaxis);
                    $scope.dataY = angular.copy(dataYaxis);
                    $scope.chartfunc2('domestic');
                }
            };
            $scope.chartfunc2 = function(type) {
                $(".charticon").addClass("active_chart");
                $(".charticon1").removeClass("active_chart");
               for (var index = 0; index < $scope.waterTabList.length; index++) {
            	   if(type=='industrial'){
                    loadValuesToWaterGraphBar('container_' + index, convertTimeStamps($scope.time), $scope.dataY, $scope.waterTabList[index]);
            	   } else if(type=='domestic'){
            		   loadValuesToWaterGraphBar('container1_' + index, convertTimeStamps($scope.time), $scope.dataY, $scope.waterTabList[index]);  
            	   }
            	   };
            };

            $scope.chartfunc1 = function(type) {
                $(".charticon1").addClass("active_chart");
                $(".charticon").removeClass("active_chart");
                for (var index = 0; index < $scope.waterTabList.length; index++) {
                	 if(type=='industrial')
                    loadValuesToWaterGraphArea('container_' + index, convertTimeStamps($scope.time), $scope.dataY, $scope.waterTabList[index]);
                	 else if(type=='domestic')
                		  loadValuesToWaterGraphArea('container1_' + index, convertTimeStamps($scope.time), $scope.dataY, $scope.waterTabList[index]);
                };
            };

            $scope.selectTab = function(index, type) {
                if (type === 'industrial') {
                    $scope.tabIndex = index;
                    $('#domestic').hide();
                    console.log("select tab index is: " + $scope.tabIndex)

                    $scope.pH = ($scope.waterMachineData[index].data[index].pHValue);
                    $scope.suspendedSolids = ($scope.waterMachineData[index].data[index].suspendedSolids);
                    $scope.bod = ($scope.waterMachineData[index].data[index].bod);
                    $scope.cod = ($scope.waterMachineData[index].data[index].cod);
                    $scope.oilGrease = ($scope.waterMachineData[index].data[index].oilGrease);
                    $scope.kld1 = ($scope.waterMachineData[index].data[index].kld);
                    setTimeout(function() {
                        $('#industrial').fadeIn();

                        loadGraphArea1($scope.waterDataList, $scope.tabIndex);
                        $scope.waterLoading = false;
                        loadGraphArea2($scope.waterDataList, $scope.tabIndex);
                        //$scope.selectTab1(index);
                    }, 300);
                } else if (type === 'domestic') {
                    $scope.tabIndex = index;
                   // $('#domestic').hide();
                    $('#industrial').hide();
                    console.log("select tab index is: " + $scope.tabIndex)

                    $scope.pH = ($scope.waterMachineData[index].data[index].pHValue);
                    $scope.suspendedSolids = ($scope.waterMachineData[index].data[index].suspendedSolids);
                    $scope.bod = ($scope.waterMachineData[index].data[index].bod);
                    $scope.cod = ($scope.waterMachineData[index].data[index].cod);
                    $scope.oilGrease = ($scope.waterMachineData[index].data[index].oilGrease);
                    $scope.kld1 = ($scope.waterMachineData[index].data[index].kld);
                    setTimeout(function() {
                    	// $('#industrial').fadeIn();

                        $('#domestic').fadeIn();

                        loadGraphArea1($scope.waterDataList, $scope.tabIndex);
                        $scope.waterLoading = false;
                        loadGraphArea3($scope.waterDataList, $scope.tabIndex);
                        //$scope.selectTab1(index);
                    }, 300);
                }
            };

            var convertTimeStamps = function(timestamps) {
                var dates = [];
                for (var i = 0; i < timestamps.length; i++) {
                    dates.push(convertTimeStamp(timestamps[i]));
                }
                return dates;
            };

            var convertTimeStamp = function(timestamp) {
                var date = new Date(timestamp);
                var h = 0;
                var m = 0;
                var s = 0;
                if (date.getHours() < 10)
                    h = '0' + date.getHours();
                else
                    h = date.getHours();
                if (date.getMinutes() < 10)
                    m = '0' + date.getMinutes();
                else
                    m = date.getMinutes();
                if (date.getSeconds() < 10)
                    s = '0' + date.getSeconds();
                else
                    s = date.getSeconds();

                var dateString = h + ':' + m + ':' + s;
                return dateString;
            };

            var getYAxisType = function(waterName) {
                var returnValue;
                if ("pH Value" === waterName) {
                    returnValue = "pHValue";
                } else if ("Suspended Solids" === waterName) {
                    returnValue = "Suspended Solids";
                } else if ("BOD" === waterName) {
                    returnValue = "BOD";
                } else if ("COD" === waterName) {
                    returnValue = "COD";
                } else if ("Oil & Grease" === waterName) {
                    returnValue = "Oil & Grease";
                } else {
                    returnValue = "Water Values";
                }
                return returnValue;
            };

            var loadValuesToWaterGraphBar = function(id, dataX, dataY, waterName) {
                var waterNameForUI = waterName;
                console.log(id + ' >> ');
                console.log(dataX + ' >dataX> ');
                console.log(dataY + ' >dataY> ');
                console.log(waterNameForUI + ' >waterNameForUI> ');


                var yAxisType = getYAxisType(waterNameForUI);
                $('#' + id).each(function() {
                    var chart = new Highcharts.Chart({
                        animation: Highcharts.svg,
                        marginRight: 10,
                        chart: {
                            renderTo: id
                        },
                        title: {
                            text: ''
                        },
                        tooltip: {
                            formatter: function() {
                                return '<b>' + waterNameForUI + '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + Highcharts.numberFormat(this.y, 2);
                            }
                        },
                        exporting: {
                            enabled: false
                        },

                        plotOptions: {
                            series: {
                                lineWidth: 1,
                                marker: {
                                    enabled: false,
                                },
                            }
                        },
                        credits: {
                            enabled: false
                        },

                        xAxis: {
                            title: {
                                text: '<b>' + 'Time' + '</b>'
                            },
                            categories: dataX
                        },

                        yAxis: {
                            title: {
                                text: '<b>' + yAxisType + '</b>'
                            },

                            plotLines: [{
                                color: 'red', // Color value
                                dashStyle: 'solid', // Style of the plot line. Default to solid
                                width: 2 // Width of the line    
                            }, {
                                color: 'red', // Color value
                                dashStyle: 'solid', // Style of the plot line. Default to solid
                                width: 2 // Width of the line    
                            }],
                        },

                        series: [{
                            name: waterNameForUI,
                            data: dataY,
                            type: 'column',
                            color: '#00acec'
                        }]

                    });
                });
            };

            var graphColor = '#00acec';
            var loadValuesToWaterGraphArea = function(id, dataX, dataY, waterName) {
                var waterNameForUI = waterName;
                var yAxisType = getYAxisType(waterNameForUI);
                $('#' + id).each(function() {
                    var chart = new Highcharts.Chart({
                        animation: Highcharts.svg,
                        marginRight: 10,
                        chart: {
                            renderTo: id
                        },
                        title: {
                            text: ''
                        },
                        tooltip: {
                            formatter: function() {
                                return '<b>' + waterNameForUI + '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + Highcharts.numberFormat(this.y, 2);
                            }
                        },
                        exporting: {
                            enabled: false
                        },

                        plotOptions: {
                            series: {
                                lineWidth: 1,
                                marker: {
                                    enabled: false,
                                },
                            }
                        },
                        credits: {
                            enabled: false
                        },

                        xAxis: {
                            title: {
                                text: '<b>' + 'Time' + '</b>'
                            },
                            categories: dataX
                        },

                        yAxis: {
                            title: {
                                text: '<b>' + yAxisType + '</b>'
                            },

                            plotLines: [{
                                color: 'red', // Color value
                                dashStyle: 'solid', // Style of the plot line. Default to solid
                                width: 2 // Width of the line    
                            }, {
                                color: 'red', // Color value
                                dashStyle: 'solid', // Style of the plot line. Default to solid
                                width: 2 // Width of the line    
                            }],
                        },
                        series: [{
                            name: waterNameForUI,
                            data: dataY,
                            type: 'areaspline',
                            color: graphColor
                        }]
                    });
                });
            };

           

            var loadValuesToGraphAreaKld = function(id, dataX, dataY, index) {
                console.log(id + ' >> ');
                console.log(dataX + ' >dataX> ');
                console.log(dataY + ' >dataY> ');
                $(id).each(function() {
                    var chart = new Highcharts.Chart({
                        type: 'spline',
                        animation: Highcharts.svg,
                        marginRight: 10,
                        chart: {
                            renderTo: this
                        },
                        title: {
                            text: ''
                        },
                        tooltip: {
                            formatter: function() {
                                return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + Highcharts.numberFormat(this.y, 2);
                            }
                        },
                        exporting: {
                            enabled: false
                        },

                        plotOptions: {
                            series: {
                                lineWidth: 1,
                                marker: {
                                    enabled: false,
                                },
                            }
                        },
                        credits: {
                            enabled: false
                        },

                        xAxis: {
                            title: {
                                text: 'Time'
                            },
                            categories: dataX
                        },

                        yAxis: {
                            title: {
                                text: 'KLD'
                            },
                        },

                        series: [{
                            name: 'kld',
                            data: dataY,
                            type: 'areaspline',
                            color: graphColor,
                            fillColor: {
                                linearGradient: {
                                    x1: 0,
                                    y1: 1,
                                    x2: 0,
                                    y2: 1
                                },
                                stops: [
                                    [1, graphColor],
                                    [0, Highcharts.Color(graphColor).setOpacity(0).get('red')],
                                ]

                            },
                            lineWidth: 1,
                            marker: {
                                enabled: false,
                            }

                        }]
                    });
                });
            };
        }
    ]);

});