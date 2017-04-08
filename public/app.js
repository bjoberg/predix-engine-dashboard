var app = angular.module('predixHackathon', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : '/templates/home.html',
            controller  : 'homeController'   
        })
        .when('/details/:tag', {
            templateUrl : '/templates/details.html',
            controller : 'detailsController'
        });
});

app.controller('detailsController', function($scope, $http, $routeParams) {
    var token;
    $scope.loadKpiData = loadKpiData;
    $scope.token = null;
    $scope.tsDataValues = null;
    $scope.engines = null;
    $scope.tag = $routeParams.tag;
    $http.get('/api/auth/')
        .success(function(data) {
            $scope.token=data;
            loadKpiData($routeParams.tag);
        })
        .error(function(data) {
            console.log('Error: ' + data);
    });

    function loadKpiData(kpiName){
		$http.get('/api/kpi/' + kpiName + '/' + $scope.token)
			.success(function(data) {
                $scope.engines = data.tags[0].results[0].attributes.AssetUri;
                parseTsDataPoints(data.tags[0].results[0].values);
                console.log(data.tags[0].results[0].attributes.AssetUri);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
    }

    function parseTsDataPoints(data) {
        var newValues = data.map(function(value) {
            return {
                    x: value[0],
                    y: "" + value[1]
                }
        });
        $scope.tsDataValues = JSON.parse(JSON.stringify(newValues));
    }

    function getEngines(data) {
        console.log(data);
    }
});

app.controller('homeController', function($scope, $http) {  
	$scope.token = null;
    $scope.tags = null;
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
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });   
    }
});
