(function() {

	var myApp = angular.module('myApp', ['firebase', 'ui.bootstrap', 'ui.router', 'uiGmapgoogle-maps']);
	myApp.config(function(uiGmapGoogleMapApiProvider) {
    	uiGmapGoogleMapApiProvider.configure({
        	key: 'AIzaSyCc5lF9SklV8T482wlgu6LulxH6mApxzkc',
        	v: '3.20', //defaults to latest 3.X anyhow
        	libraries: 'weather,geometry,visualization'
    	});
	})

	myApp.controller('myCtrl', function($scope, $firebaseAuth, $firebaseObject, $http){ // Do we need http?
		$scope.markers = [];
    	$scope.map = { center: { latitude: 47.6097, longitude: -122.3331 }, zoom: 12 };


		var ref = new Firebase('https://walkwithme343c.firebaseio.com/');

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
			      // userImage:$scope.userImage,
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
		 	$scope.userID = false;
		 	console.log ($scope.userID);
		  // This will redirect to the login page
		  // some way to redirect
		}

		// Pass Profile info to Firebase
		$scope.setProfile = function() {
			
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
	 	.state('profile', {
	 		url:'/profile',
	 		templateUrl: 'templates/profile.html',
	 		controller: 'myCtrl',
	 	})
	})

	//controller for sign in page
	// myApp.controller('signInController', function($scope){
	 	
	// })

	// // Controller for create page
	// myApp.controller('createController', function($scope){
	 	
	// })

})();