

var app = angular.module('predixHackathon', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : '/templates/AboutUs.html',
            controller  : 'AboutController'
        })
        
        .when('/', {
            templateUrl : '/templates/home.html',
            controller  : 'mainController'   
        });


});
app.controller('AboutController', function($scope, $http){
console.log('Test');
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
                validateDataPoints(data.tags[0].results[0].values);
                $scope.engines = data.tags[0].results[0].attributes.AssetUri;
			   console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});

    //end function
    }
    
    function validateDataPoints(data) {
        console.log(data);
        // var arrTwo = [];
        // var newValues = data.map(function(value) {
        //     var arrOne = [];
        //     arrOne.push(value[0]);
        //     arrOne.push(value[1]);
        //     return arrTwo.push(arrOne);
        // });
        var newValues = data.map(function(value) {
            return {
                    x: value[0],
                    y: "" + value[1]
                }
        });
        console.log('newValues', newValues);
        $scope.dataValues = JSON.parse(JSON.stringify(newValues));
        // $scope.dataValues = JSON.parse('[{"x":1465416480000,"y":"0"},{"x":1465416540000,"y":"0.897277832"},{"x":1465416600000,"y":"1"},{"x":1465416660000,"y":"2"},{"x":1465416720000,"y":"1"},{"x":1465416780000,"y":"0.897697449"},{"x":1465416840000,"y":"0.897796631"}]');       
        //[{"x":1465416480000,"y":"0"},{"x":1465416540000,"y":"0.897277832"},{"x":1465416600000,"y":"1"},{"x":1465416660000,"y":"2"},{"x":1465416720000,"y":"1"},{"x":1465416780000,"y":"0.897697449"},{"x":1465416840000,"y":"0.897796631"}]
        //[{"x":1491620870028,"y":"1191"},{"x":1491620870028,"y":"1182"},{"x":1491620870028,"y":"1181"},{"x":1491620870028,"y":"1165"},{"x":1491620870028,"y":"1163"},{"x":1491620870028,"y":"1156"},{"x":1491620870028,"y":"1126"},{"x":1491620870028,"y":"1122"},{"x":1491620870028,"y":"1117"},{"x":1491620870028,"y":"1115"}]
        // console.log('dataValues', $scope.dataValues);
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
                console.log(data.results);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });   
    }
});
