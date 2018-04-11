angular.module('app').controller('ComponentsController', ['$rootScope', '$scope', function($rootScope, $scope) {
	$scope.bigData = {};

	$scope.bigData.breakfast = false;
	$scope.bigData.lunch = false;
	$scope.bigData.dinner = false;
	
	$scope.radioModel = 'Soup';

	$scope.isCollapsed = true;


	$rootScope.$on('$viewContentLoaded', function (event){
		console.log("View Content Loaded");
 	});

}]);
