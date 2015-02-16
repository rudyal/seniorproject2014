

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
			console.log($locationProvider);
			
			
			$stateProvider
				.state('forum.posts', {
					url: '/posts/{id}',
					templateUrl: '/posts.html',
					controller: 'PostsCtrl',
					resolve: {
					  post: ['$stateParams', 'posts', function($stateParams, posts) {
						console.log($stateParams);
					    return posts.getCom($stateParams.id);
					  }]
					  // ,
					  // postPromise: ['posts', function(posts){
					  //   return posts.getAll();
					  // }]
					}
				})
				.state('forum.post', {
					url: '/post',
					templateUrl: '/post.html',
					controller: 'MainCtrl'
				})
				.state('forum.edit', {
					url: '/posts/edit/{id}',
					templateUrl: '/edit.html',
					controller: 'PostsCtrl',
					resolve: {
					  post: ['$stateParams', 'posts', function($stateParams, posts) {
						console.log($stateParams);
					    return posts.getCom($stateParams.id);
					  }]
					}
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
				.state('locked',{
					url: '/locked',
					templateUrl: '/locked.html',
					controller: 'HomeCtrl',
					resolve: {
					  userPromise: ['user', function(user){
					    return user.getAllUsers();
					  }]
					}
				})
				.state('locked2',{
					url: '/locked/{murl}',
					templateUrl: '/locked.html',
					controller: 'AccessCtrl',
					resolve: {
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
					  	console.log("get forumtype");
					  	//$state.go('/popular');

					  	// $location.path('/popular');
					  	// b = 
					  	// if(b.status == 500) {
					   //      $urlRouterProvider.url('/popular');
					   //  }
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
	.factory('uniqueService', ['$http', function ($http) {
        var dataFactory = {};

        dataFactory.checkEmail = function (id) {
            if (!id) id = 0;
            return $http.get('/api/unemail/' + id).then(
                function (results) {
                	console.log(results);
                	if(results.data.length>0){
                		return results.data.status;
                	}else{
                		return "Unique";
                	}
                    
                });
        };
        dataFactory.checkUser = function (id) {
            if (!id) id = 0;
            return $http.get('/api/unuser/' + id).then(
                function (results) {
                	console.log("results");
                	console.log(results);
                	if(results.data.length>0){
                		return results.data.status;
                	}else{
                		return "Unique";
                	}
                    
                });
        };
        dataFactory.checkForum = function (id) {
            if (!id) id = 0;
            return $http.get('/api/unforum/' + id).then(
                function (results) {
                	console.log("results");
                	console.log(results);
                	if(results.data.length>0){
                		return results.data.status;
                	}else{
                		return "Unique";
                	}
                    
                });
        };
         return dataFactory;
	}])
       
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
			console.log("in create post");
		  return $http.post('/posts', post);
		};
		o.edit = function(post, id) {
			console.log("edit post");
		  return $http.post('/posts/edit/' + id, post);
		};
		o.delete = function(id) {
			console.log("delete post");
		  return $http.delete('/posts/delete/' + id);
		};



		o.getAll = function() {
		    return $http.get('/posts').success(function(data){
		      angular.copy(data, o.posts);
		    });
		  };
		o.getCom = function(id) {
		  return $http.get('/posts/' + id).then(function(res){
		  	console.log("single Post");
		  	//console.log(res.data);
		  	return res.data;
		  });
		};
		o.editCom = function(comment, id) {
			console.log("edit comment");
		  return $http.post('/comments/edit/' + id, comment);
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
	.factory('access', ['$http', '$window', function($http, $window){
		var u = {
			user: [
				  {title: 'Need help with angular', upvotes: 5, date: '2012-04-23T18:25:43.511Z', username: 'franker'}
				]
		};
		u.check = function(data) {
			var b =  $http.post('/api/locked', data).then(function(res){
			  	//console.log("returning data");
			  	//console.log(res);

				if(res.status==200){
					//console.log("200");
					//console.log(res);
					$window.location.href = '/'+ res.data.murl;
				}
			  	
			}).catch(function(res, status) {

			  	if(res.data.error=="0001"){
			  		console.log("if 0001");
			  		return res.data.error;

			  		//redirect to page, pass form url
			  		//$window.location.href = '/popular';
			  	}
			});
			  //);
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

		  var b =  $http.get('api/' + murl).then(function(res){
		  	console.log("returning data");
		  	console.log(res);
		  	
		  	//$window.location.href = '/popular';
		  	angular.copy(res.data, u.forum);
		  	return u.forum;
		  }).catch(function(res, status) {
		  	// 0001 = access code, 0002=anonymous users
		  	if(res.data.error=="0001"){
		  		console.log("if 0001");
		  		// access code required

		  		//redirect to page, pass form url
		  		//$window.location.href = '/popular';
		  	}
		  	if(res.data.error=="0002"){
		  		console.log("if 0002");
		  		// Anonymous Users not allowed

		  		// dont redirect here

		  	}
		  	console.log("returning data 2");
		  	console.log(res);
		  	console.log(status);
		  	console.log("res.data");

		  	console.log(res.data);

		  	$window.location.href = '/locked/'+res.data.URL;
		    console.error('Gists error', res.status, res.data);
		  });
		  //);
		 return b;
		  
		};
		u.getAllByCreater = function(createrID) {
		  return $http.get('api/forums/' + createrID).then(function(res){
		  	//console.log("returning data");
		  	//console.log(res.data);
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

.filter('postOrderBy', function () {
   return function (arr) {

   	console.log("custom sort");
   	console.log(arr);

     var numbers = [];
     var newWorldOrder = [];

  //      angular.forEach(arr, function(item){
  //      	console.log("comments");
  //      	console.log(item.comments);

  //      	item.comments.sort(function(a, b) {
  //      		console.log("a");
  //      	console.log(a);
  //      	console.log("b");
  //      	console.log(b);
		//     a = new Date(a.dateModified);
		//     b = new Date(b.dateModified);
		//     return a>b ? -1 : a<b ? 1 : 0;
		// });

		// console.log("comments sorted");
  //      	console.log(item.comments);



  //           if(typeof item == 'number' ){
  //             numbers.push(item);     
  //           }
  //           else
  //             newWorldOrder.push(item);   


  //          });
			return arr.sort(
				(function(index){
				    return function(a, b){
				    	console.log("a");
				    	console.log(a);
				    	console.log(a.comments);
				        return (a[index] === b[index] ? 0 : (a[index] < b[index] ? -1 : 1));
				    };
				})(3)
			); // 2 is the index
        //return numbers.sort().concat(newWorldOrder);
     };
})

.directive('wcUnique', ['uniqueService', function (uniqueService) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
        	element.bind('keyup', function (e) {
                if (!ngModel || !element.val()) return;
                var keyProperty = scope.$eval(attrs.wcUnique);
                var currentValue = element.val();
                console.log(keyProperty);
                if(keyProperty.property=='email'){
                	uniqueService.checkEmail(currentValue)
                    .then(function (unique) {
                        //Ensure value that being checked hasn't changed
                        //since the Ajax call was made
                        if (currentValue == element.val()) { 
                            ngModel.$setValidity('unique', unique);
                        }
                    }, function () {
                        //Probably want a more robust way to handle an error
                        //For this demo we'll set unique to true though
                        ngModel.$setValidity('unique', true);
                    });
                }
                if(keyProperty.property=='username'){
                	uniqueService.checkUser(currentValue)
                    .then(function (unique) {
                        //Ensure value that being checked hasn't changed
                        //since the Ajax call was made
                        if (currentValue == element.val()) { 
                        	console.log("hete");
                        	console.log(unique);
                            ngModel.$setValidity('unique', unique);
                        }
                    }, function () {
                        //Probably want a more robust way to handle an error
                        //For this demo we'll set unique to true though
                        ngModel.$setValidity('unique', true);
                    });
                }
                if(keyProperty.property=='forum'){
                	uniqueService.checkForum(currentValue)
                    .then(function (unique) {
                        //Ensure value that being checked hasn't changed
                        //since the Ajax call was made
                        if (currentValue == element.val()) { 
                        	console.log("hete");
                        	console.log(unique);
                        	if (typeof unique !== 'undefined') {
                        		console.log("unset comname");
                        		if(scope.buildForum.comname.$dirty == true){
									scope.buildForum.comname.$setValidity('unique', unique);
                        		}else{
									scope.buildForumWU.comname.$setValidity('unique', unique);
                        		}
                        		
                        		
                        	}
                            ngModel.$setValidity('unique', unique);
                        }
                        console.log("test");
                    }, function () {
                        //Probably want a more robust way to handle an error
                        //For this demo we'll set unique to true though
                        console.log("hete22");
                        ngModel.$setValidity('unique', true);
                    });
                }
                if(keyProperty.property=='forumfirst'){
                	//set currentValue to scope comurl
                	console.log("heyho");
                	console.log(scope);
                	currentValue = scope.comurl;
                	uniqueService.checkForum(currentValue)
                    .then(function (unique) {
                        //Ensure value that being checked hasn't changed
                        //since the Ajax call was made
                        if (currentValue == element.val()) { 
                        	console.log("hete");
                        	console.log(unique);
                        	// if (typeof unique !== 'undefined') {
                        	// 	scope.comurl.$setValidity('unique', unique);
                        	// } else{
                        	// 	 ngModel.$setValidity('unique', unique);
                        	// }
                        	console.log("ngmodel");
                        	console.log(ngModel);
                        	ngModel.$setValidity('unique', unique);
                        	//scope.comurl.$setValidity('unique', unique);
                           
                        }else{
                        	console.log("danger");
                        }
                        console.log("test");
                    }, function () {
                        //Probably want a more robust way to handle an error
                        //For this demo we'll set unique to true though
                        console.log("hete22");
                        ngModel.$setValidity('unique', true);
                    });
                }
                
            });
		}
    }
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

				$scope.deletePost = function(postid) {
					posts.delete(postid).success(function(post) {
						var match;
						var ranker;

						forum.forum.posts.map(function (pos, rank) {
						  if (parseInt(pos._id) == parseInt(post._id)) {
						    match = pos;
						    ranker = rank;
						  } else {}
						});
						alert("Post Deleted");
						forum.forum.posts.splice(ranker, 1);
						$scope.forum = forum.forum;
					    $location.path(forum.forum.url);
					});

				};

				$scope.isCreater = function(postuser) {
				if (user.user._id == postuser)
				  return true;
				else 
				  return false;
				};

				$scope.loadComment = function(comment) {

					
					//console.log("LOADINGGGGGG COMMMENTNNTT");

					if(typeof $scope.body != 'undefined'){
						return false;
					}else{
						$scope.isEdit = comment;
				  		$scope.body = comment.body.$$unwrapTrustedValue();

				  		return true;
					}

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
				    $location.path(forum.forum.url);
				  });
				$scope.title = '';
				$scope.bode = '';
				$scope.link = '';
				$scope.exdate = '';
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
			//console.log($scope);
			//console.log($scope.userforums);
		}]
	)
	.controller('AccessCtrl',
		['$scope', '$stateParams', 'user', 'access',  function($scope, $stateParams, user, access){
			//$scope.tester = "hello profile";
			console.log("Access controller");
			//console.log($stateParams.murl);
			
			// Get User
			$scope.user=user.user;
			// Get murl and set it in scope
			$scope.murl=$stateParams.murl

			$scope.wrongcode = false;
			// Make a Function for forum submit
			$scope.submitAccessForm = function(){
				
		      	access.check({
					  access: $scope.accesscode,
					  murl: $stateParams.murl,
				}).then(function(data) {
					
					console.log(data);
					if(data==0001){
						$scope.wrongcode = true;
					}
				    
				  });
		     }

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
			$scope.options = function() {
				$(".input.access").toggle();
			}
			$scope.changeURL = function(comname) {
				if(typeof comname != 'undefined'){
					comname2 = comname.replace(/^\s\s*/, '');
					$comname3 = comname2.replace(/\s\s*$/, '');
					$comname4 = $comname3.replace(/\s+/g, '-').toLowerCase();
			        $scope.comurl = $comname4;
				}else{
					$scope.comurl = " ";
				}
				
		     }
		     $scope.updateURL = function(comurl) {
				$scope.comurl = comurl;
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
					  access: $scope.$$childTail.accesscodebox,
					  allowanon: $scope.$$childTail.anonuserbool,
					  allowreg: $scope.$$childTail.reguserbool
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
					access: $scope.$$childTail.accesscodebox,
					allowanon: $scope.$$childTail.anonuserbool,
					allowreg: $scope.$$childTail.reguserbool
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
		['$scope', '$location', '$sce', 'forum', 'posts', 'post',
			function($scope, $location, $sce, forum, posts, post){

				$scope.post = post;

				$scope.forum = forum.forum;

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

				$scope.addEditComment = function(comment){
					  	console.log("editing comment");
					  	console.log($scope.body);
					  	console.log(comment);
					  	console.log(comment._id);
					  	//comment.body = $sce.trustAsHtml(comment.body);
					  	console.log(comment.body.$$unwrapTrustedValue());
					  	if($scope.body === '') { return; }
					  	
						posts.editCom({
							body: $scope.body
						}, comment._id).success(function(post) {
							$scope.body = '';
							console.log("started from the bottom now we here");
							console.log($scope.isEdit);
							$scope.isEdit = null;
							console.log($scope.isEdit);
							// We Need Post ID

							// We Need Comment ID

							// Update scope comment to editted one
							    
						  });
						$scope.body = '';
						delete $scope.isEdit;
					  }

				$scope.loadEdit = function(post){

					if(typeof $scope.title != 'undefined'){
						return false;
					}else{

						$scope.title = post.title;
				  		$scope.bode = post.bode.$$unwrapTrustedValue();
		            	//console.log(post.bode.$$unwrapTrustedValue());
				  		console.log($scope.title);
				  		return true;
					}
				  	
				}

				  	 $scope.editPost = function(postid, forumurl){
					  	console.log("editing");
					  	console.log(postid);
					  	if($scope.title === '') { return; }
					  	//if($scope.$$childTail.title === '') { return; }
					  	
						posts.edit({
							title: $scope.title,
							link: $scope.link,
							bode: $scope.bode
						}, postid).success(function(post) {
							console.log("started from the bottom now we here");
						    //$scope.forum.posts.push(post);
						    $location.path(forum.forum.url);
						  });
						$scope.title = '';
						$scope.bode = '';
						$scope.link = '';
						$scope.exdate = '';
					  }



			  	
			}
		]
	);

