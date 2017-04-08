

var app = angular.module('predixHackathon', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : '/templates/home.html',
            controller  : 'homeController'
        });
});

app.controller('mainController', function($scope, $http) {
	var token;
    $scope.loadKpiData = loadKpiData;
	$scope.token = null;
    //console.log('hello, this is the main controller');
	// Removed auth token request from the time-series request
	$http.get('/api/auth/')
	        .success(function(data) {
				// Store the auth token to be used for time-series requests
				token = data;   
				$scope.token=token;
				console.log(token);
				loadKpiData('Engine Speed');
			})
        .error(function(data) {
            console.log('Error: ' + data);
    });

    function loadKpiData(kpiName){
		// if auth is null
		 // alert
		// Add the auth token as a parameter for a time-series request
		$http.get('/api/kpi/' + kpiName + '/' + $scope.token)

			.success(function(data) {
			   console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});

    //end function
    }
    
//end controller
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
