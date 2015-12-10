(function() {

	var myApp = angular.module('myApp', ['firebase', 'ui.bootstrap', 'ui.router', 'ngMap']);

	myApp.service('shared', function () {
		var userToken;

		return {
			getuserToken: function() {
				return userToken;
			},
			setuserToken: function(val) {
				userToken = val;
			}
		}
	})

	myApp.controller('mapCtrl', function(NgMap, $scope, $compile,$firebaseObject, $firebaseArray, shared) {
		NgMap.getMap().then(function(map) {
			$scope.map = map;
		});

		$scope.queries = {}
		var ref1 = new Firebase('https://walkwithme343c.firebaseio.com/');

		var queriesRef1 = ref1.child("queries1");
		$scope.queriesArr1 = $firebaseArray(queriesRef1)

		var usersRef1 = ref1.child("users");
		    	//Login/ User Authentication
				// firebaseObject of users
				$scope.users1 = $firebaseArray(usersRef1);	 

				$scope.showMarkers = function(){
					
					$scope.users1.forEach(function(d){
						$scope.username = d.username;
						$scope.queries = d.query;


					})
					
				}

				$scope.showInfo = function(ev, userID) {
					$scope.walk = $scope.queries[userID];

					$scope.map.showInfoWindow('infoWindow', this)
				}

				$scope.deleteWalk = function(walk){
					$scope.walk.delete = true;
				}
			}
			);

	myApp.controller('myCtrl', function($scope, $firebaseAuth, $firebaseObject, $http, $firebaseArray, shared){ // Do we need http?
		var ref = new Firebase('https://walkwithme343c.firebaseio.com/');

		var queriesRef = ref.child("queries");
		$scope.queriesArr = $firebaseArray(queriesRef)

		var usersRef = ref.child("users");
    	//Login/ User Authentication
		// firebaseObject of users
		$scope.users = $firebaseObject(usersRef);
		$scope.authObj = $firebaseAuth(ref);

		// Test if already logged in
		var authData = $scope.authObj.$getAuth();
		if (authData) {
			$scope.userID = authData.uid;
			shared.setuserToken($scope.userID);
		}
		
		// Weather App
		$(document).ready(function() {
			$scope.loadWeather()
		});

		$scope.loadWeather = function() {
			$.simpleWeather({
				location: 'Seattle, WA',
				woeid: '',
				unit: 'f',
				success: function(weather) {
					html = '<h2><i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</h2>';
					html += '<ul><li>'+weather.city+', '+weather.region+'</li>';
					html += '<li class="currently">'+weather.currently+'</li>';
					html += '<li>'+weather.wind.direction+' '+weather.wind.speed+' '+weather.units.speed+'</li></ul>';

					$(".weather").html(html);
				},
				error: function(error) {
					$(".weather").html('<p>'+error+'</p>');
				}
			});
		}
		
    	// SignIn function
    	$scope.signIn = function() {
    		$scope.logIn().then(function(authData){
    			$scope.userID = authData.uid;
    		})
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
			  	}
			  	$scope.users.$save()

			  })
			  
			}




		// This will log in existing users
		$scope.logIn = function() {
			return $scope.authObj.$authWithPassword({
				email: $scope.user,
				password: $scope.pass
			})
		}

		// LogIn function for new users
		$scope.newlogIn = function() {
			return $scope.authObj.$authWithPassword({
				email: $scope.newEmail,
				password: $scope.newPass
			})
		}

		// LogOut function
		$scope.logOut = function() {
			$scope.authObj.$unauth();
		 	$scope.userID = 'false'; // can probably set this to authobj.uid
		 }

		 $scope.pushData = function() {
		 	var bloop = "users/" + shared.getuserToken();
		 	var test = ref.child(bloop);
		 	test.child('hello').push({
		 		"comment":"dlskfd" 
		 	})

		 }

		 //The map functions
		 $scope.query = {}

		 $scope.addMarker = function(){
		 	var id = "users/" + shared.getuserToken();
		 	ref.child(id).child("query").push($scope.query);
		 	$scope.query = {}
		 }

		})

	// This configures each state that the webpage can be. Each state
	// will have a different url
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
	    

	})

	myApp.run(['$state', function ($state) {
		$state.transitionTo('home');
	}])


})();