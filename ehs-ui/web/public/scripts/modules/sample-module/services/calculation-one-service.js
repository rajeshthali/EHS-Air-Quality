define(['angular', './services-module'], function(angular, sampleModule) {
    'use strict';

 // service
    sampleModule.factory('CalculationOneService', [ function() {
    	return {

    		getAquiValues : function(ehsJson) {
    			// console.log(ehsJson);
    			var quiValues = [];

    			for (var i = 0; i < ehsJson.body.length; i++) {
    				// console.log(ehsJson.body[i]);
    				var quiValueNO2 = this.getAqiValue(this.avg(ehsJson.body[i].NO2), 'NO2', ehsJson.body[i].name);
    				var quiValueSO2 = this.getAqiValue(this.avg(ehsJson.body[i].SO2), 'SO2', ehsJson.body[i].name);
    				var quiValuePM2_5 = this.getAqiValue(this.avg(ehsJson.body[i].PM2_5), 'PM2_5', ehsJson.body[i].name);

    				/*console.log("--" + ehsJson.body[i].name + "--");
    				console.log("NO2 : " + JSON.stringify(quiValueNO2));
    				console.log("SO2 : " + JSON.stringify(quiValueSO2));
    				console.log("PM2_5 : " + JSON.stringify(quiValuePM2_5));
    				console.log("-----------------------------");*/
    				quiValues.push(quiValueNO2);
    				quiValues.push(quiValueSO2);
    				quiValues.push(quiValuePM2_5);

    			}

    			// console.log(quiValues)

    			return quiValues;
    		},
    		avg : function(values) {
    			var avg = 0.0;
    			for (var i = 0; i < values.length; i++) {
    				// console.log(values[i]);
    				avg += values[i].y;
    			}
    			avg = avg / values.length;
    			return avg;
    		},
    		getAqiValue : function(avg, param, name) {
    			var aqiValue = {};
    			aqiValue.name = name;
    			aqiValue.avg = parseFloat(avg);
    			aqiValue.param = param;
    			switch (param) {
    			case 'PM10':
    				if (avg >= 0 && avg <= 50) {
    					aqiValue.rage = 'GOOD';
    					aqiValue.b_lo = 0;
    					aqiValue.b_hi = 50;
    					aqiValue.i_lo = 0;
    					aqiValue.i_hi = 50;
    					
    				} else if (avg >= 51 && avg <= 100) {
    					aqiValue.rage = 'SATISFACTORY';
    					aqiValue.b_lo = 51;
    					aqiValue.b_hi = 100;
    					aqiValue.i_lo = 51;
    					aqiValue.i_hi = 100;
    				} else if (avg >= 101 && avg <= 250) {
    					aqiValue.rage = 'MODERATE';
    					aqiValue.b_lo = 101;
    					aqiValue.b_hi = 250;
    					aqiValue.i_lo = 101;
    					aqiValue.i_hi = 200;
    				} else if (avg >= 251 && avg <= 350) {
    					aqiValue.rage = 'POOR';
    					aqiValue.b_lo = 251;
    					aqiValue.b_hi = 350;
    					aqiValue.i_lo = 201;
    					aqiValue.i_hi = 300;
    				} else if (avg >= 351 && avg <= 430) {
    					aqiValue.rage = 'VERY_POOR';
    					aqiValue.b_lo = 351;
    					aqiValue.b_hi = 430;
    					aqiValue.i_lo = 301;
    					aqiValue.i_hi = 400;
    				} else if (avg > 430) {
    					aqiValue.rage = 'SEVERE';
    					aqiValue.b_lo = 430;
    					aqiValue.b_hi = 0;
    					aqiValue.i_lo = 401;
    					aqiValue.i_hi = 500;
    				}

    				break;
    			case 'PM2_5':
    				if (avg >= 0 && avg <= 30) {
    					aqiValue.rage = 'GOOD';
    					aqiValue.b_lo = 0;
    					aqiValue.b_hi = 30;
    					aqiValue.i_lo = 0;
    					aqiValue.i_hi = 50;
    				} else if (avg >= 31 && avg <= 60) {
    					aqiValue.rage = 'SATISFACTORY';
    					aqiValue.b_lo = 31;
    					aqiValue.b_hi = 60;
    					aqiValue.i_lo = 51;
    					aqiValue.i_hi = 100;
    				} else if (avg >= 61 && avg <= 90) {
    					aqiValue.rage = 'MODERATE';
    					aqiValue.b_lo = 61;
    					aqiValue.b_hi = 90;
    					aqiValue.i_lo = 101;
    					aqiValue.i_hi = 200;
    				} else if (avg >= 91 && avg <= 120) {
    					aqiValue.rage = 'POOR';
    					aqiValue.b_lo = 91;
    					aqiValue.b_hi = 120;
    					aqiValue.i_lo = 201;
    					aqiValue.i_hi = 300;
    				} else if (avg >= 121 && avg <= 250) {
    					aqiValue.rage = 'VERY_POOR';
    					aqiValue.b_lo = 121;
    					aqiValue.b_hi = 250;
    					aqiValue.i_lo = 301;
    					aqiValue.i_hi = 400;
    				} else if (avg > 250) {
    					aqiValue.rage = 'SEVERE';
    					aqiValue.b_lo = 430;
    					aqiValue.b_hi = 0;
    					aqiValue.i_lo = 401;
    					aqiValue.i_hi = 500;
    				}
    				break;
    			case 'NO2':
    				if (avg >= 0 && avg <= 40) {
    					aqiValue.rage = 'GOOD';
    					aqiValue.b_lo = 0;
    					aqiValue.b_hi = 40;
    					aqiValue.i_lo = 0;
    					aqiValue.i_hi = 50;
    				} else if (avg >= 41 && avg <= 80) {
    					aqiValue.rage = 'SATISFACTORY';
    					aqiValue.b_lo = 41;
    					aqiValue.b_hi = 80;
    					aqiValue.i_lo = 51;
    					aqiValue.i_hi = 100;
    				} else if (avg >= 81 && avg <= 180) {
    					aqiValue.rage = 'MODERATE';
    					aqiValue.b_lo = 81;
    					aqiValue.b_hi = 180;
    					aqiValue.i_lo = 101;
    					aqiValue.i_hi = 200;
    				} else if (avg >= 181 && avg <= 280) {
    					aqiValue.rage = 'POOR';
    					aqiValue.b_lo = 181;
    					aqiValue.b_hi = 280;
    					aqiValue.i_lo = 201;
    					aqiValue.i_hi = 300;
    				} else if (avg >= 281 && avg <= 400) {
    					aqiValue.rage = 'VERY_POOR';
    					aqiValue.b_lo = 281;
    					aqiValue.b_hi = 400;
    					aqiValue.i_lo = 301;
    					aqiValue.i_hi = 400;
    				} else if (avg > 400) {
    					aqiValue.rage = 'SEVERE';
    					aqiValue.b_lo = 400;
    					aqiValue.b_hi = 0;
    					aqiValue.i_lo = 401;
    					aqiValue.i_hi = 500;
    				}
    				break;
    			case 'O3':
    				if (avg >= 0 && avg <= 50) {
    					aqiValue.rage = 'GOOD';
    					aqiValue.b_lo = 0;
    					aqiValue.b_hi = 50;
    					aqiValue.i_lo = 0;
    					aqiValue.i_hi = 50;
    				} else if (avg >= 51 && avg <= 100) {
    					aqiValue.rage = 'SATISFACTORY';
    					aqiValue.b_lo = 51;
    					aqiValue.b_hi = 100;
    					aqiValue.i_lo = 51;
    					aqiValue.i_hi = 100;
    				} else if (avg >= 101 && avg <= 168) {
    					aqiValue.rage = 'MODERATE';
    					aqiValue.b_lo = 101;
    					aqiValue.b_hi = 168;
    					aqiValue.i_lo = 101;
    					aqiValue.i_hi = 200;
    				} else if (avg >= 169 && avg <= 208) {
    					aqiValue.rage = 'POOR';
    					aqiValue.b_lo = 169;
    					aqiValue.b_hi = 208;
    					aqiValue.i_lo = 201;
    					aqiValue.i_hi = 300;
    				} else if (avg >= 209 && avg <= 748) {
    					aqiValue.rage = 'VERY_POOR';
    					aqiValue.b_lo = 209;
    					aqiValue.b_hi = 748;
    					aqiValue.i_lo = 301;
    					aqiValue.i_hi = 400;
    				} else if (avg > 748) {
    					aqiValue.rage = 'SEVERE';
    					aqiValue.b_lo = 748;
    					aqiValue.b_hi = 0;
    					aqiValue.i_lo = 401;
    					aqiValue.i_hi = 500;
    				}
    				break;
    			case 'CO2':
    				if (avg >= 0 && avg <= 1.0) {
    					aqiValue.rage = 'GOOD';
    					aqiValue.b_lo = 0;
    					aqiValue.b_hi = 1.0;
    					aqiValue.i_lo = 0;
    					aqiValue.i_hi = 50;
    				} else if (avg > 1.0 && avg <= 2.0) {
    					aqiValue.rage = 'SATISFACTORY';
    					aqiValue.b_lo = 1.1;
    					aqiValue.b_hi = 2.0;
    					aqiValue.i_lo = 51;
    					aqiValue.i_hi = 100;
    				} else if (avg > 2.0 && avg <= 10) {
    					aqiValue.rage = 'MODERATE';
    					aqiValue.b_lo = 2.1;
    					aqiValue.b_hi = 10;
    					aqiValue.i_lo = 101;
    					aqiValue.i_hi = 200;
    				} else if (avg > 10 && avg <= 17) {
    					aqiValue.rage = 'POOR';
    					aqiValue.b_lo = 10.1;
    					aqiValue.b_hi = 17;
    					aqiValue.i_lo = 201;
    					aqiValue.i_hi = 300;
    				} else if (avg > 17 && avg <= 34) {
    					aqiValue.rage = 'VERY_POOR';
    					aqiValue.b_lo = 17.1;
    					aqiValue.b_hi = 34;
    					aqiValue.i_lo = 301;
    					aqiValue.i_hi = 400;
    				} else if (avg > 34) {
    					aqiValue.rage = 'SEVERE';
    					aqiValue.b_lo = 748;
    					aqiValue.b_hi = 0;
    					aqiValue.i_lo = 401;
    					aqiValue.i_hi = 500;
    				}
    				break;
    			case 'SO2':
    				if (avg >= 0 && avg <= 40) {
    					aqiValue.rage = 'GOOD';
    					aqiValue.b_lo = 0;
    					aqiValue.b_hi = 40;
    					aqiValue.i_lo = 0;
    					aqiValue.i_hi = 50;
    				} else if (avg >= 41 && avg <= 80) {
    					aqiValue.rage = 'SATISFACTORY';
    					aqiValue.b_lo = 41;
    					aqiValue.b_hi = 80;
    					aqiValue.i_lo = 51;
    					aqiValue.i_hi = 100;
    				} else if (avg >= 81 && avg <= 380) {
    					aqiValue.rage = 'MODERATE';
    					aqiValue.b_lo = 81;
    					aqiValue.b_hi = 380;
    					aqiValue.i_lo = 101;
    					aqiValue.i_hi = 200;
    				} else if (avg >= 381 && avg <= 800) {
    					aqiValue.rage = 'POOR';
    					aqiValue.b_lo = 381;
    					aqiValue.b_hi = 800;
    					aqiValue.i_lo = 201;
    					aqiValue.i_hi = 300;
    				} else if (avg >= 801 && avg <= 1600) {
    					aqiValue.rage = 'VERY_POOR';
    					aqiValue.b_lo = 209;
    					aqiValue.b_hi = 748;
    					aqiValue.i_lo = 301;
    					aqiValue.i_hi = 400;
    				} else if (avg > 1600) {
    					aqiValue.rage = 'SEVERE';
    					aqiValue.b_lo = 1600;
    					aqiValue.b_hi = 0;
    					aqiValue.i_lo = 401;
    					aqiValue.i_hi = 500;
    				}
    				break;
    			case 'NH3':
    				if (avg >= 0 && avg <= 200) {
    					aqiValue.rage = 'GOOD';
    					aqiValue.b_lo = 0;
    					aqiValue.b_hi = 200;
    					aqiValue.i_lo = 0;
    					aqiValue.i_hi = 50;
    				} else if (avg >= 201 && avg <= 400) {
    					aqiValue.rage = 'SATISFACTORY';
    					aqiValue.b_lo = 201;
    					aqiValue.b_hi = 400;
    					aqiValue.i_lo = 51;
    					aqiValue.i_hi = 100;
    				} else if (avg >= 401 && avg <= 800) {
    					aqiValue.rage = 'MODERATE';
    					aqiValue.b_lo = 401;
    					aqiValue.b_hi = 800;
    					aqiValue.i_lo = 101;
    					aqiValue.i_hi = 200;
    				} else if (avg >= 801 && avg <= 1200) {
    					aqiValue.rage = 'POOR';
    					aqiValue.b_lo = 801;
    					aqiValue.b_hi = 1200;
    					aqiValue.i_lo = 201;
    					aqiValue.i_hi = 300;
    				} else if (avg >= 1201 && avg <= 1800) {
    					aqiValue.rage = 'VERY_POOR';
    					aqiValue.b_lo = 1201;
    					aqiValue.b_hi = 1800;
    					aqiValue.i_lo = 301;
    					aqiValue.i_hi = 400;
    				} else if (avg > 1800) {
    					aqiValue.rage = 'SEVERE';
    					aqiValue.b_lo = 1800;
    					aqiValue.b_hi = 0;
    					aqiValue.i_lo = 401;
    					aqiValue.i_hi = 500;
    				}
    				break;
    			case 'PB':
    				//console.log(avg);
    				if (avg >= 0 && avg <= 0.5) {
    					aqiValue.rage = 'GOOD';
    					aqiValue.b_lo = 0;
    					aqiValue.b_hi = 0.5;
    					aqiValue.i_lo = 0;
    					aqiValue.i_hi = 50;
    				} else if (avg > 0.5 && avg <= 1.0) {
    					aqiValue.rage = 'SATISFACTORY';
    					aqiValue.b_lo = 0.6;
    					aqiValue.b_hi = 1.0;
    					aqiValue.i_lo = 51;
    					aqiValue.i_hi = 100;
    				} else if (avg > 1.0 && avg <= 2.0) {
    					aqiValue.rage = 'MODERATE';
    					aqiValue.b_lo = 1.1;
    					aqiValue.b_hi = 2.0;
    					aqiValue.i_lo = 101;
    					aqiValue.i_hi = 200;
    				} else if (avg > 2.0 && avg <= 3.0) {
    					aqiValue.rage = 'POOR';
    					aqiValue.b_lo = 2.1;
    					aqiValue.b_hi = 3.0;
    					aqiValue.i_lo = 201;
    					aqiValue.i_hi = 300;
    				} else if (avg > 3.0 && avg <= 3.5) {
    					aqiValue.rage = 'VERY_POOR';
    					aqiValue.b_lo = 3.1;
    					aqiValue.b_hi = 3.5;
    					aqiValue.i_lo = 301;
    					aqiValue.i_hi = 400;
    				} else if (avg > 3.5) {
    					aqiValue.rage = 'SEVERE';
    					aqiValue.b_lo = 1800;
    					aqiValue.b_hi = 0;
    					aqiValue.i_lo = 401;
    					aqiValue.i_hi = 500;
    				}
    				//console.log(aqiValue);
    				break;
    				
    			default:
    				break;
    			}

    			return aqiValue;
    		}
    	};
    } ]);
    
    
    
    

});
