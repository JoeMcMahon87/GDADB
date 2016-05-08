// Export the controller
var myApp = angular.module('gdadb', []);

// Defining wrapper Routes for our API
myApp.controller('appCtrl', function appCtrl($scope, $http, $location) {
	$scope.formData = {};

	$http.get('/plays')
		.success(function(data) { 
			$scope.plays = data;
		})
		.error(function(data) {
			console.log("Error: " + data);
		});

	$scope.createPlay = function() {
		$http.post('/play', $scope.formData)
			.success(function(data) {
				$scope.formData = {};
				$scope.plays = data;
			})
			.error(function(data) {
				console.log("Error: " + data);
			});
	};

	$scope.searchPlay = function() {
		$http.get('/play/?q=' + $scope.formData.search)
			.success(function(data) {
				$scope.formdata = {};
				$scope.plays = data;
			})
			.error(function(data) {
				console.log("Error: " + data);
			});
	};

	$scope.showPlay = function(id) {
		$http.get('/showPlay/' + id)
			.success(function(data) {
				$scope.play = data;
			})
			.error(function(data) {
				console.log("Error: " + data);
			});
	};

	$scope.deletePlay = function(id) {
		$http.delete('/play/' + id)
			.success(function(data) {
				$scope.plays = data;
			})
			.error(function(data) {
				console.log("Error: " + data);
			});
	};

});
