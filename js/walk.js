(function() {

	var myApp = angular.module('myApp', ['firebase', 'ui.bootstrap', 'ui.router']);

	myApp.controller('myCtrl', function($scope, $firebaseAuth, $firebaseObject, $http, $firebaseArray){ // Do we need http?
		var ref = new Firebase('https://walkwithme343c.firebaseio.com/');

		var usersRef = ref.child("users");
		var queriesRef = ref.child("queries");

		$scope.queriesArr = $firebaseArray(queriesRef)

		//The map functions
		$scope.query = {}

    	//Login/ User Authentication
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

    	// SignIn function
		$scope.signIn = function() {
		  	$scope.logIn().then(function(authData){
		    	$scope.userID = authData.uid;
		 	})
		    // This will redirect to spot.html once the user is logged in
		    if ($scope.userID) { 
		    	console.log("signed in");
		    	// take user to different page now
		    }
		}

		// SignUp function
		$scope.signUp = function() {
			// Create user
		 	$scope.authObj.$createUser({
		    	email: $scope.newEmail,
		    	password: $scope.newPass,      
		  	})

		  	// Once the user is created, call the logIn function
		  	.then($scope.newlogIn)

			  // Once logged in, set and save the user data
			.then(function(authData) {
			    $scope.userID = authData.uid;
			    $scope.users[authData.uid] ={
				    username : $scope.newName, 
				    first: $scope.firstName,
					last: $scope.lastName,
				    phone: $scope.phone
				}
				$scope.users.$save()
			    
			    // This will redirect to spot.html once the user is logged in
			    if ($scope.userID) {
			    	// code to redirect user if already signed in 
			    }
			})

			// Catch any errors
			.catch(function(error) {
			    console.error("Error: ", error);
			});
		}

		// This will log in existing users
		$scope.logIn = function() {
			console.log('log in');
			return $scope.authObj.$authWithPassword({
		    	email: $scope.user,
		    	password: $scope.pass
		  	})
		}

		// LogIn function for new users
		$scope.newlogIn = function() {
			console.log('new log in')
		 	return $scope.authObj.$authWithPassword({
		    	email: $scope.newEmail,
		    	password: $scope.newPass
		  	})
		}

		// LogOut function
		$scope.logOut = function() {
		 	$scope.authObj.$unauth();
		 	$scope.userID = 'false'; // can probably set this to authobj.uid
		 	console.log ($scope.userID);
		  // This will redirect to the login page
		  // some way to redirect
		}

	})

	myApp.config(function($stateProvider) {
	    $stateProvider
	    // Each state routes to a different page
	 	.state('signIn', {
		    url:'/signIn',
		    templateUrl: 'templates/signIn.html',
		    controller: 'myCtrl',
	 	})
	 	.state('create', {
		    url:'/create',
		    templateUrl: 'templates/create.html',
		    controller: 'myCtrl',
	 	})
	 	.state('start', {
 			url:'/start',
 			templateUrl: 'templates/start.html',
 			controller: 'myCtrl',
	 	})
	 	.state('home',{
	 		url:'/',
	 		templateUrl:'templates/home.html',
	 		controller: 'myCtrl'
	 	})
	 	.state('newWalk',{
	 		url:'/newwalk',
	 		templateUrl:'templates/newWalk.html',
	 		controller: 'myCtrl'
	 	})
	 	.state('search', {
	 		url:'/search',
	 		templateUrl:'templates/search.html',
	 		controller:'myCtrl'
	 	})

	 	//No Function ATM
	 	.state('approvedeny', {
	 		url:'/approvedeny',
	 		templateUrl:'templates/approvedeny.html',
	 		controller:'myCtrl'
	 	})
	})

	myApp.run(['$state', function ($state) {
		$state.transitionTo('home');
	}])


})();