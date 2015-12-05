(function() {

	var myApp = angular.module('myApp', ['firebase', 'ui.router']);
	myApp.controller('myCtrl', function($scope, $firebaseAuth, $firebaseObject, $http){ // Do we need http?
		console.log('weeeeeeee');
		
		var ref = new Firebase('https://walkwithme343.firebaseio.com/');

		var usersRef = ref.child("users");

		// firebaseObject of users
		$scope.users = $firebaseObject(usersRef);
		$scope.authObj = $firebaseAuth(ref);

		// Test if already logged in
		var authData = $scope.authObj.$getAuth();
		if (authData) {
		  $scope.userID = authData.uid;
		  console.log($scope.userID);
		}

		console.log(authData);

	})


})();