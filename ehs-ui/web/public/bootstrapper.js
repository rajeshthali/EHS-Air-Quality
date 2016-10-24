/* jshint undef: true, unused: false */

require([ 'config' ], function(config) {
	'use strict';

	var cssFiles = [ '../bower_components/bootstrap/dist/css/bootstrap.min', '/css/style', '../bower_components/c3/c3.min' ];
	var util = {
		loadCssAll : function(array) {
			if (array.length)
				for (var i = 0; i < array.length; i++) {
					this.loadCss(array[i] + ".css");
				}
		},
		loadCss : function(url) {
			var link = document.createElement("link");
			link.type = "text/css";
			link.rel = "stylesheet";
			link.href = url;
			//console.log(url);
			document.getElementsByTagName("head")[0].appendChild(link);
		}
	};
	util.loadCssAll(cssFiles);

	require([ 'angular', 'app' ], function(angular, app) {
		angular.bootstrap(document.querySelector('body'), [ app.name ]);
	});
});
