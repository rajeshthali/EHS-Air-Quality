var q = {
	"start" : 1473331320839,
	"end" : 1473332920839,
	"tags" : [ {
		"name" : "AQI-Machine",
		"limit" : 10,
		"groups" : [ {
			"name" : "attribute",
			"attributes" : [ "NO2", "PM2_5", "SO2" ]
		} ],
		"filters" : {
			"attributes" : {
				"assetName" : "Heller-Machine",
				"floor" : 1
			}
		}
	} ]
};

var q = {
	"start" : 1474266587730,
	"end" : 1474266647730,
	"tags" : [ {
		"name" : "AQI-Machine",
		"limit" : 0,
		"order" : null,
		"aggregations" : [],
		"filters" : {
			"attributes" : {},
			"measurements" : null,
			"qualities" : null
		},
		"groups" : [ {
			"name" : "attribute",
			"values" : null,
			"attributes" : [ "PM10", "PM2_5", "NO2", "O3", "CO2", "SO2", "NH3", "PB" ]
		} ]
	} ]
};

var hygiene_qury = {
	"start" : 1474262754109,
	"end" : 1474262814109,
	"tags" : [ {
		"name" : "Hygiene",
		"limit" : 0,
		"order" : null,
		"aggregations" : [],
		"filters" : {
			"attributes" : null,
			"measurements" : null,
			"qualities" : null
		},
		"groups" : [ {
			"name" : "attribute",
			"values" : null,
			"attributes" : [ "temprature", "humidity", "noise" ]
		} ]
	} ]
};