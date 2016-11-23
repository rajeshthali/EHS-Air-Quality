define([ 'angular', './controllers-module'], function(angular, controllers) {
	'use strict';
	controllers.controller('DashboardsCtrlFloor', [
			'$compile',
			'$state',
			'$timeout',
			'$interval',
			'$scope',
			'$rootScope',
			'$http',
			'$log',
			'PredixAssetService',
			'PredixViewService',
			'AuthService',
			'HygieneService',
			'DashBoardService',
			function($compile, $state, $timeout, $interval, $scope, $rootScope, $http, $log, PredixAssetService, PredixViewService, AuthService, HygieneService, DashBoardService) {
				var floorArray = [];
				var maxFloor = 3;
				var maxOpacity = .99;
				var interval = 25 * 1000;
				var isMachineCompleated = false;
				var isAreaCompleated = false;
				var compliant = 'all';
				$rootScope.floor = '0';
				$scope.setCompliant = function(compliantValue) {
					compliant = compliantValue;
					$scope.selectFoor($scope.floor);
				};
				AuthService.getTocken(function(token) {
					for (var i = 0; i < maxFloor; i++) {
						loadAqiMachine(i);
						loadAqiArea(i);
						loadHygiene(i);
					}
				});
				var loadAqiMachine = function(floor) {
					DashBoardService.getAqiMachineValues(floor, interval, function(res) {
						for (var i = 0; i < res.length; i++) {
							for (var j = 0; j < res[i].assets.length; j++) {
								var left = DashBoardService.positionList.aqiMachine[res[i].floorNo][j].left;
								var top = DashBoardService.positionList.aqiMachine[res[i].floorNo][j].top;
								addTag(res[i].floorNo, 'a', top, left, res[i].assets[j], 'machine');
							}
						}
						$scope.animateFloor(floor, 'machine');
						// console.log('machine > ' + floor);
					});
				};

				var loadAqiArea = function(floor) {
					DashBoardService.getAqiAreaValues(floor, interval, function(res) {
						for (var i = 0; i < res.length; i++) {
							for (var j = 0; j < res[i].assets.length; j++) {
								var left = DashBoardService.positionList.aqiArea[res[i].floorNo][j].left;
								var top = DashBoardService.positionList.aqiArea[res[i].floorNo][j].top;
								addTag(res[i].floorNo, 'a', top, left, res[i].assets[j], 'area');
							}
						}
						$scope.animateFloor(floor, 'area');
						// console.log('area > ' + floor);
					});
				};

				var loadHygiene = function(floor) {
					DashBoardService.getHygieneValues(floor, interval, function(res) {
						for (var i = 0; i < res.length; i++) {
							for (var j = 0; j < res[i].assets.length; j++) {
								var left = DashBoardService.positionList.hygiene[res[i].floorNo][j].left;
								var top = DashBoardService.positionList.hygiene[res[i].floorNo][j].top;
								addTag(res[i].floorNo, 'h', top, left, res[i].assets[j], 'hygiene');
							}
						}
						$scope.animateFloor(floor, 'hygiene');
						// console.log('hygiene > ' + floor);
					});
				};

				for (var i = 0; i < maxFloor; i++) {
					floorArray.push($('#floor_' + i));
				}

				$scope.floor = 0;
				$scope.isAllFloorVisible = false;

				$(".floor_text").on('click', function(e) {
					console.log(e.target.id);
				});
				$(".base_map").on('click', function(e) {
					switch (e.target.id) {
					case 'floor_0':
						$scope.selectFoor(0);
						break;
					case 'floor_1':
						$scope.selectFoor(1);
						break;
					case 'floor_2':
						$scope.selectFoor(2);
						break;
					default:
						break;
					}
				});

				$scope.animateFloor = function(i, iconClass) {
					var item = null;
					// console.log(i+' > '+iconClass);
					if (iconClass) {
						item = $('#floor_' + i + '> .icon.' + iconClass);
					} else {
						item = $('#floor_' + i + '> .icon');
					}

					switch (compliant) {
					case 'all':
						$('.non-complaint').show();
						$('.complaint').show();
						break;
					case 'compliant':
						$('.non-complaint').hide();
						$('.complaint').show();
						break;
					case 'non':
						$('.non-complaint').show();
						$('.complaint').hide();
						break;
					}

					item.each(function(node) {
						var thisObject = this;
						var data = $(this).css('top');
						$(this).css('top', '0');
						$(this).css('opacity', '0.0');
						$(this).animate({
							top : data,
							opacity : 1.0
						}, 400, function() {
							$(thisObject).css('top', data);
						});
					});
				};

				$scope.selectFoor = function(floor) {
					// console.log('Current Floor : ' + floor);
					var element = $('#floor_' + floor);
					for (var i = 0; i < maxFloor; i++) {
						if (floorArray[i].attr('id') === element.attr('id')) {
							floorArray[i].fadeTo(200, maxOpacity);
						} else {
							floorArray[i].fadeOut("fast");
							// floorArray[i].fadeTo("fast",
							// 0.2);
						}
					}
					$scope.floor = floor;
					$scope.animateFloor(floor);
					$scope.isAllFloorVisible = false;
					$rootScope.floor = $scope.floor;
				};
				$scope.showAllFloorToggle = function() {
					if ($scope.isAllFloorVisible) {
						$scope.selectFoor($scope.floor);
						$scope.isAllFloorVisible = false;
					} else {
						$scope.showAllFloor();
						$scope.isAllFloorVisible = true;
					}
				};

				$scope.showAllFloor = function() {
					for (var i = 0; i < maxFloor; i++) {
						floorArray[i].fadeTo("fast", maxOpacity);
					}
				};
				$scope.upFloor = function() {
					$scope.floor = (($scope.floor + 1) % maxFloor);
					$scope.selectFoor($scope.floor);
				};
				$scope.downFloor = function() {
					$scope.floor = $scope.floor - 1;
					if ($scope.floor < 0) {
						$scope.floor = 2;
					}
					$scope.selectFoor($scope.floor);
				};
				if (!$rootScope.floor)
					$rootScope.floor = 0
				$scope.selectFoor($rootScope.floor);

				var addTag = function(floorIndex, tag, top, left, data, iconClass) {
					// console.log(data);
					var avgHygiene = null;
					var avgAqi = null;
					var type = '';
					if (tag === 'a') {
						avgAqi = avgArrayValue(data.data.value);
						if (avgAqi > 50) {
							tag = tag + 'r';
							type = 'non-complaint';
						} else {
							tag = tag + 'g';
							type = 'complaint';
						}
					} else if (tag === 'h') {
						avgHygiene = hygieneAvg(data.data);
						if (avgHygiene.humidity > 35) {
							tag = tag + 'r';
							type = 'non-complaint';
						} else {
							tag = tag + 'g';
							type = 'complaint';
						}
					}
					var floor = floorArray[floorIndex];
					var image = '';
					var color = '';
					switch (tag) {
					case 'ar':
						image = 'air_red.png';
						color = 'r';
						break;
					case 'ag':
						image = 'air_green.png';
						color = 'g';
						break;
					case 'hg':
						image = 'Industrial_hygiene_green.png';
						color = 'g';
						break;
					case 'hr':
						image = 'Industrial_hygiene_red.png';
						color = 'r';
						break;

					default:
						break;
					}
					var innerHtml = '';

					if (tag === 'ag' || tag === 'ar') {
						innerHtml = '<div class="r_box_title ' + color + '">' + data.assetName + '</div>' + '<div class="popup_content"> Prominent Pollutant : <b>' + data.data.maxAqi.name + ' ' + data.data.maxAqi.aqiValue + '</b> </div>' + '<div class="popup_content"> Average AQI : <b>' + avgAqi
								+ '</b></div>';
					} else if (tag === 'hg' || tag === 'hr') {

						innerHtml = '<div class="r_box_title ' + color + '">' + data.assetName + '</div>' + '<div class="popup_content"> Humidity : <b>' + avgHygiene.humidity + ' %</b></div>' + '<div class="popup_content"> Noise : <b>' + avgHygiene.noise + ' db</b></div>'
								+ '<div class="popup_content"> Temperature : <b>' + avgHygiene.temperature + ' &#8451;</b></div>';
					}

					var html = '<div ng-click="gotoDetails(\'' + floorIndex + '\',\'' + iconClass + '\',\'' + data.assetName + '\')" class="icon ' + iconClass + ' ' + type + '" style="top: ' + top + '%; left: ' + left + '%; background: url(\'../images/' + image + '\');">'
							+ '<div style="line-height: 20px;"  class="popup popup-dropdown-content ' + tag + '" >' + innerHtml + '</div></div>';
					floor.append($compile(html)($scope));
				};
				$scope.gotoDetails = function(floor, type, assetName) {
					document.querySelector('px-app-nav').markSelected('/airquality'); 
					// console.log(floor + ' ' + type + ' ' + assetName);
					if (type == 'machine' || type === 'area') {
						$state.go('aqi-details', {
							'floor' : floor,
							'type' : type,
							'assetName' : assetName
						})
					}
					else
						{
						//alert(floor);
						document.querySelector('px-app-nav').markSelected('/industrial-hygiene'); 
						$state.go('industrial-hygiene', {
							'floor' : floor,
							'type' : type,
							'assetName' : assetName
						})
						}

					
				};
				var avgArrayValue = function(data) {
					var avg = 0.0;
					for (var i = 0; i < data.length; i++) {
						avg += data[i];
					}
					avg = avg / data.length;
					return Number((avg).toFixed(2));
				};

				var hygieneAvg = function(data) {
					// console.log(data);
					// console.log(data.length);
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

				// addTag(0, 'ar', 40, 30);
				// addTag(0, 'ag', 40, 20);
				// addTag(0, 'hg', 30, 41);
				// addTag(0, 'ar', 20, 50);
				// addTag(0, 'hr', 21, 60);
				//
				// addTag(1, 'ar', 40, 30);
				// addTag(1, 'ag', 35, 76);
				// addTag(1, 'hg', 30, 41);
				// addTag(1, 'ar', 34, 50);
				// addTag(1, 'hr', 21, 60);
				//
				// addTag(2, 'ar', 40, 30);
				// addTag(2, 'ag', 40, 20);
				// addTag(2, 'hg', 20, 41);
				// addTag(2, 'ar', 20, 50);
				// addTag(2, 'hr', 21, 60);

			} ]);

});
