var app = angular.module('predixHackathon', ['ngRoute']);

/**
 * Define the routes for the application.
 */
app.config(function($routeProvider) {
    $routeProvider
        .when('/About', {
            templateUrl : '/templates/AboutUs.html',
            controller  : 'AboutController'
        })
        .when('/', {
            templateUrl : '/templates/home.html',
            controller  : 'homeController'   
        })
        .when('/details/:tag', {
            templateUrl : '/templates/details.html',
            controller : 'detailsController'
        });
});

/**
 * Controller for the about page.
 */
app.controller('AboutController', function($scope, $http){
    
});

/**
 * Controller for the details page.
 */
app.controller('detailsController', function($scope, $http, $routeParams) {
    // Scope variables
    $scope.token = null;
    $scope.getEngineData = getEngineData;
    $scope.tsDataValues = null;
    $scope.engines = null;
    $scope.tag = $routeParams.tag;
    $scope.badgeCount = 0;
    $scope.showEngineSpinner = true;
    $scope.showGraphSpinner = true;

    // Established authentication with the server
    $http.get('/api/auth/')
        .success(function(data) {

            $scope.token=data;
            loadKpiData($scope.tag);
        })
        .error(function(data) {
            console.log('Error: ' + data);
    });

    // Get the KPI data
    function loadKpiData(kpiName){
		$http.get('/api/kpi/' + kpiName + '/' + $scope.token)
			.success(function(data) {
                initializeEngines(data.tags[0].results[0].attributes.AssetUri);
                parseTsDataPoints(data.tags[0].results[0].values);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
    }

    // Parse the KPI data and format it for the timeseries graph
    function parseTsDataPoints(data) {
        var newValues = data.map(function(value) {
            return {
                    x: value[0],
                    y: "" + value[1]
                }
        });
        $scope.tsDataValues = JSON.parse(JSON.stringify(newValues));
        $scope.showGraphSpinner = false;
    }

    // Initialize empty engine objects
    function initializeEngines(data) {
        var newEngines = data.map(function(value) {
            return {
                    engine: value,
                    selected: false,
                    data: []
                }
        });
        $scope.engines = JSON.parse(JSON.stringify(newEngines)); 
        $scope.showEngineSpinner = false;
    }

    // Get the tag data for a specific engine
    function getEngineData(kpiName, engineName) {
        // Update the badge count
        updateTsBadgeCount()

        // Check to see if the engine already has data
        var engineNeedsData = false;
        var engine = $scope.engines.find(function(item, i){
            if(item.engine === engineName){
                if(item.data.length === 0) {
                    engineNeedsData = true;
                    return item;
                }
            }
        });

        // If the engine needs data, go get it.
        if (engineNeedsData) {
            $http.get('/api/kpi/' + kpiName + '/engine/' + $scope.token + '?engine=' + engineName)
                .success(function(data) {
                    console.log(data);
                    parseEngines(data, engineName);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        }
    }

    // Look through the local engines object and update it's data field
    function parseEngines(data, engineName) {
        var index = 0
        var engine = $scope.engines.find(function(item, i){
            if(item.engine === engineName){
                return item;
            }
            index = i + 1;
        });
        formatEngineData(data.tags[0].results[0].values, index)
    }

    // Parse the engine data and format it for the timeseries graph
    function formatEngineData(data, index) {
        var newEngineValues = data.map(function(value) {
            return {
                    x: value[0],
                    y: "" + value[1]
                }
        });
        $scope.engines[index].data = JSON.parse(JSON.stringify(newEngineValues));
    }

    function updateTsBadgeCount() {
        $scope.badgeCount = 0;
        for (var i = 0; i < $scope.engines.length; i++) {
            if ($scope.engines[i].selected == true) {
                $scope.badgeCount++;
            }
        }
    }
});

/**
 * Controller for the home page
 */
app.controller('homeController', function($scope, $http) {  
	$scope.token = null;
    $scope.tags = null;
    $scope.showTagSpinner = true;
	$http.get('/api/auth/')
	    .success(function(data) {
            $scope.token=data;
            loadTagData();
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    function loadTagData() {
        $http.get('/api/tags/' + $scope.token)
            .success(function(data) {
                $scope.tags = data.results;
                $scope.showTagSpinner = false;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });   
    }
});
