

angular.module('forumBody', ['ui.router', 'froala', 'infinite-scroll'])
	.value('froalaConfig', {
        inlineMode: false,
        placeholder: 'Enter Text Here'
    })
	.config([
		'$stateProvider',
		'$urlRouterProvider', '$locationProvider',
		function($stateProvider, $urlRouterProvider, $locationProvider){
			// $urlRouterProvider.when('builder', '/builder');
			//$urlRouterProvider.when('/login', '/loginer');
			
			
			$stateProvider
				.state('forum.posts', {
					url: '/posts/{id}',
					templateUrl: '/posts.html',
					controller: 'PostsCtrl',
					resolve: {
					  post: ['$stateParams', 'posts', function($stateParams, posts) {
						console.log($stateParams);
					    return posts.getCom($stateParams.id);
					  }],
					  postPromise: ['posts', function(posts){
					    return posts.getAll();
					  }]
					}
				})
				.state('forum.post', {
					url: '/post',
					templateUrl: '/post.html',
					controller: 'MainCtrl'
				})
				.state('home.poster',{
					url: '/profile/{id}',
					templateUrl: '/profile.html',
					controller: 'ProfileCtrl',
					resolve: {
					  postPromise: ['user', function(user){
					    return user.getAllUsers();
					  }]
					}
				})
				// .state('login',{
				// 	url: '/login',
				// 	templateUrl: '/login.html',
				// 	controller: 'MainCtrl',
				// 	resolve: {
				// 	  userPromise: ['user', function(user){
				// 	    return user.login();
				// 	  }]
				// 	}
				// })
				.state('profile',{
					url: '/profile',
					templateUrl: '/profile.html',
					controller: 'ProfileCtrl',
					resolve: {
					  postPromise: ['user', function(user){
					    return user.getAllUsers();
					  }]
					}
				})
				.state('posts', {
					url: '/posts/{id}',
					templateUrl: '/posts.html',
					controller: 'PostsCtrl',
					resolve: {
					  post: ['$stateParams', 'posts', function($stateParams, posts) {

					    return posts.getCom($stateParams.id);
					  }],
					  postPromise: ['posts', function(posts){
					    return posts.getAll();
					  }]
					}
				})
				.state('home',{
					url: '/',
					templateUrl: '/build.html',
					controller: 'HomeCtrl',
					resolve: {
					  forumPromise: ['$stateParams', 'forum', function($stateParams, forum){
					  	console.log("home get all forums");
					    return forum.getAllForums();
					  }],
					  userPromise: ['user', function(user){
					    return user.getAllUsers();
					  }]
					}
				})
				.state('popular',{
					url: '/popular',
					templateUrl: '/homepage.html',
					controller: 'HomeCtrl',
					resolve: {
					  forumPromise: ['$stateParams', 'forum', function($stateParams, forum){
					  	console.log("home get all forums");
					  	console.log(forum.getAllForums());
					    return forum.getAllForums();
					  }],
					  userPromise: ['user', function(user){
					    return user.getAllUsers();
					  }]
					}
				})
				.state('forum',{
					url: '/{murl}',
					templateUrl: '/home.html',
					controller: 'ForumCtrl',
					resolve: {
					  forumPromise: ['$stateParams', 'forum', function($stateParams, forum){
					  	console.log("state param murl");
					  	console.log(forum.getAllByUrl($stateParams.murl));
					    return forum.getAllByUrl($stateParams.murl);
					  }],
					  userPromise: ['user', function(user){
					    return user.getAllUsers();
					  }]
					}
				});

			// $urlRouterProvider.when('/{murl}', {
			// 	redirectTo: '#/{murl}'
			// });
			$urlRouterProvider.otherwise('/#');
			$locationProvider.html5Mode(true);

				
			
			

		}
	])
	.factory('posts', ['$http', function($http){
		var o = {
			posts: [
				  {title: 'Need help with angular', upvotes: 5, date: '2012-04-23T18:25:43.511Z'},
				  {title: 'I know a lot about drupal', upvotes: 2, date: '2012-06-23T18:25:43.511Z'},
				  {title: 'Selling a thingy', upvotes: 15, date: '2012-05-23T18:25:43.511Z'},
				  {title: 'How should I make this app', upvotes: 9, date: '2013-04-23T18:25:43.511Z'},
				  {title: 'Would you rather', upvotes: 4, comments: [
						{author: 'Joe', body: 'Cool Post!', upvotes: 0},
						{author: 'Jesse', body: 'Great Idea!', upvotes: 0}
					], date: '2014-04-23T18:25:43.511Z'}
				]
		};
		var op = {
			forum: [
				{posts: [
					{title: "hello"}
				]}
			]
		}
		o.create = function(post) {
		  return $http.post('/posts', post);
		};
		o.getAll = function() {
		    return $http.get('/posts').success(function(data){
		      angular.copy(data, o.posts);
		    });
		  };
		o.getCom = function(id) {
		  return $http.get('/posts/' + id).then(function(res){
		  	console.log(res.data);
		  	return res.data;
		  });
		};
		o.addComment2 = function(id, comment) {
		  return $http.post('/posts/' + id + '/comments', comment);
		};
		return o;
	}])
	.factory('user', ['$http','forum', function($http, forum){
		var u = {
			user: [
				  {title: 'Need help with angular', upvotes: 5, date: '2012-04-23T18:25:43.511Z', username: 'franker'}
				]
		};
		u.getAllUsers = function() {
			
		    return $http.get('/api/profile').success(function(data){
		      angular.copy(data, u.user);
		    });
		  };
		u.login = function() {
			
		    return $http.get('/login').success(function(data){
		      //angular.copy(data, u.user);
		    });
		  };
		u.createUser = function(userd,forumd) {
		    var b = $http.post('/signup', userd).success(function(data){
				console.log("Creating Forum");
		     	forum.create(forumd);
		    	console.log("User Account Created");
		    });
		  return b;
		  };
		return u;

	}])
	.factory('forum', ['$http', '$window', function($http, $window){
		var u = {
			forum: [
				{title: 'forum itelle'}
			]
		};
		var op = {
			forum: [
				{posts: [
					{title: "hello"}
				]}
			]
		}
		u.getAllForums = function() {
			return $http.get('/forums').success(function(data){
		    	//console.log(data);
		      angular.copy(data, u.forum);
		    });
		  };
		u.getAllByUrl = function(murl) {
		  return $http.get('api/' + murl).then(function(res){
		  	console.log("returning data");
		  	console.log(res.data);
		  	angular.copy(res.data, u.forum);
		  	return u.forum;
		  });
		};
		u.getAllByCreater = function(createrID) {
		  return $http.get('api/forums/' + createrID).then(function(res){
		  	console.log("returning data");
		  	console.log(res.data);
		  	angular.copy(res.data, u.forum);
		  	console.log(u.forum);
		  	return u.forum;
		  });
		};
		u.create = function(forum) {
		    var b = $http.post('/builder', forum).success(function(data){
		    	console.log("Forum Build Success");
		    	$window.location.href = '/'+ forum.url;
		    });
		  return b;
		  };
		return u;

	}])
	.controller('MainCtrl', 
		['$scope', '$location','forum', 'posts', 'user',
			function($scope, $location, forum, posts, user){
				console.log("scope");
				console.log($scope);
			  $scope.user = user.user.username;

			  $scope.test = 'Hello world!';

			  $scope.posts = posts.posts;
			  $scope.forum = forum.forum;

			  $scope.isLoggedIn = function() {

				if (typeof user.user.username != 'undefined')
				  return true;
				else 
				  return false;

				};

			  $scope.loadMore = function() {
			    var last = $scope.forum.posts[$scope.forum.posts.length - 1];
			    for(var i = 1; i <= 8; i++) {
			      $scope.forum.posts.push({title: 'Need help with angular', upvotes: 5, date: '2012-04-23T18:25:43.511Z'});
			    }
			  };
			  
			  $scope.addPost = function(forumtypeid){
			  	console.log("postingggg");
			  	console.log($scope);
			  	if($scope.title === '') { return; }
			  	//if($scope.$$childTail.title === '') { return; }
			  	
				posts.create({
					title: $scope.title,
					link: $scope.link,
					bode: $scope.bode,
					expirationdate: $scope.exdate,
					forumtype: forumtypeid
				}).success(function(post) {
					console.log("started from the bottom now we here");
				    $scope.forum.posts.push(post);
				    $location.path('forum');
				  });
				$scope.title = '';
				$scope.bode = '';
				$scope.link = '';
			  }
			  $scope.incrementUpvotes = function(post){
			  	post.upvotes += 1;
			  }
			  $scope.addLeg = function(){
			  	$scope.sidebar = true;
    			$scope.sidebar_template = '/posts/5436f7f947c04b74308e645e'; 
			  }
			}
		]
	)
	.controller('ProfileCtrl',
		['$scope', 'user', 'forum', function($scope, user, forum){
			//$scope.tester = "hello profile";
			console.log("profile controller");
			
			// Get User
			$scope.user=user.user;
			// Get All Forums by this user
			if (typeof user.user._id !== 'undefined') {
			    console.log("my user");
				console.log(user.user._id);
				forum.getAllByCreater(user.user._id).then(function(data) {
	            	$scope.userforums = data;
	        	});
			}
			
			//$scope.userforums = $scope.getforums();
			console.log($scope);
			console.log($scope.userforums);
		}]
	)
	.controller('ForumCtrl',
		['$scope', 'user', 'forum', function($scope, user, forum){
			//$scope.tester = "hello profile";
			console.log("Forum Control");
			console.log(user);
			$scope.user = user.user.username;

			  $scope.isLoggedIn = function() {

				if (typeof user.user.username != 'undefined')
				  return true;
				else 
				  return false;

				};
			// $scope.getAllByUrl = function(){
			// 	console.log()

			// }
		}]
	)
	.controller('HomeCtrl',
		['$scope', 'user', 'forum', function($scope, user, forum){
			//$scope.tester = "hello profile";
			console.log("Home Control");
			
			forum.getAllForums().then(function(data) {
	            $scope.forum = data.data;
	        });

			console.log($scope);

		}]
	)
	.controller('BuildCtrl',
		['$scope', '$timeout', '$location', 'forum',  'user', function($scope, $timeout, $location, forum, user){
			//$scope.tester = "hello profile";
			console.log(user.user);
			//$scope.forum = forum;
			$scope.user = user.user;
			$scope.changeURL = function(comname) {
				$comname2 = comname.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
				$comname3 = $comname2.replace(/\s+/g, '-').toLowerCase();
		        $scope.comurl = $comname3;
		     }
		     console.log('user');
		     
		     console.log($scope);
		     $scope.isLoggedIn = function() {

				if (typeof user.user.username != 'undefined')
				  return true;
				else 
				  return false;

				};
		     $scope.isEven = function(value) {

				if (value % 2 == 0)
				  return true;
				else 
				  return false;

				};
		     

		      $scope.submitForm = function(){

		      	forum.create({
					  title: $scope.$$childTail.comname,
					  url: $scope.comurl,
					  access: null,
					  allowanon: true,
					  allowreg: true
				});
				//var url = $scope.comurl;
				//$scope.changeRoute('/'+url);
		      }
		      $scope.submitFormWU = function(){

				var url = $scope.comurl;

		      	user.createUser({
					  username: $scope.$$childTail.username,
					  email: $scope.$$childTail.email,
					  password: $scope.$$childTail.password
				},{
					title: $scope.$$childTail.comname,
					url: $scope.comurl,
					access: null,
					allowanon: true,
					allowreg: true
				});
				//$scope.changeRoute('/'+url)
		      }
		      $scope.changeRoute = function(url, forceReload) {
			        $scope = $scope || angular.element(document).scope();
			        if(forceReload || $scope.$$phase) { // that's right TWO dollar signs: $$phase
			            console.log(1);
			        console.log(url);
			            window.location = url;
			        
			        } else {
			        	console.log(2);
			        	console.log(url);
			            $location.path(url);
			             
			            $scope.$apply();
			        }
			    };
		      
		}]
	)
	.controller('PostsCtrl', 
		['$scope','$sce', 'posts', 'post',
			function($scope, $sce, posts, post){

				$scope.post = post;

				$scope.post.bode = $sce.trustAsHtml(post.bode);

				for (var i = post.comments.length - 1; i >= 0; i--) {
				    $scope.post.comments[i].body = $sce.trustAsHtml(post.comments[i].body);
				}

				//$scope.post.comments.body = $sce.trustAsHtml(post.comments.body);

				$scope.addComment = function(){
				  if($scope.body === '') { return; }
				  posts.addComment2(post._id, {
				    body: $scope.body,
				    author: 'user',
				  }).success(function(comment) {
				  	comment.body = $sce.trustAsHtml(comment.body);
				    $scope.post.comments.push(comment);
				  });
				  $scope.body = '';
				};
			}
		]
	);

