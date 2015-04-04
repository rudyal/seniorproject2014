

angular.module('forumBody', ['ui.router', 'froala', 'infinite-scroll', 'angular-momentjs'])
	.value('froalaConfig', {
        inlineMode: false,
        placeholder: 'Enter Text Here'
    })
	.config([
		'$stateProvider',
		'$urlRouterProvider', '$locationProvider', 
		function($stateProvider, $urlRouterProvider, $locationProvider){
			$stateProvider
				.state('forum.posts', {
					url: '/posts/{id}',
					templateUrl: '/posts.html',
					controller: 'PostsCtrl',
					resolve: {
					  post: ['$stateParams', 'posts', function($stateParams, posts) {
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
		  	//console.log("single Post");
		  	//console.log(res.data);
		  	if (typeof res.data.user.profilepic != 'undefined'){
				//console.log("has it");
			}else {
				//console.log("doesnt");
				res.data.user.profilepic ='user.png';
			}
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
		    	
		      angular.copy(data, u.forum);
		    });
		  };
		u.getAllByUrl = function(murl) {

		  var b =  $http.get('api/' + murl).then(function(res){
		  	console.log("returning data");
		  	//console.log(JSON.stringify(res.data.posts));
		  	if(res.data.posts.length <= 0){
		  		// Bring in a welcome post
		  		res.data.posts = [{"_id":"551700121f24f11827281357","user":{"_id":"5516f0691f24f11827281354","__v":0,"ip":"127.0.0.1","username":"efvevevf","updated":"2015-03-28T18:18:17.413Z","datejoined":"2015-03-28T18:18:17.413Z","local":{"password":"$2a$08$Q9tDOuiSnOq9lG38hIjnhOsb9iJIGc8ZnnEzdY7mQxS90HGeKygWC","email":"fwerfwer@errf.com"}},"title":"Welcome to Discuss One","forumtype":"5516fa971f24f11827281356","__v":0,"forumcategory":[],"bode":"<h3 style=\"margin-left: 0px; text-align: center;\" class=\"\">This is place to build forums quickly and share what's important.</h3><p class=\"\"><br></p><blockquote class=\"\">Like a killer quote</blockquote><p class=\"\"><br></p><pre class=\"\">&lt;h1&gt; Some nice functionality &lt;/h1&gt;</pre><p class=\"\"><br></p><p class=\"\"><br></p><p class=\"\"><img class=\"fr-fin\" data-fr-image-preview=\"false\" alt=\"Image title\" src=\"http://rack.0.mshcdn.com/media/ZgkyMDEyLzEyLzA0LzlkLzE1YmVzdGNhdG1lLmFIOC5q…B4NTM0IwplCWpwZw/81fb5716/5f7/15-best-cat-memes-ever-meow--3283dd863e.jpg\" width=\"286\"></p><p class=\"\"><br></p>","comments":[],"upvotes":0,"date":"2015-03-28T19:25:06.206Z"}]
		  	}
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
		  	// console.log("returning data 2");
		  	// console.log(res);
		  	// console.log(status);
		  	// console.log("res.data");

		  	// console.log(res.data);

		  	$window.location.href = '/locked/'+res.data.URL;
		    //console.error('Gists error', res.status, res.data);
		  });
		  //);
		 return b;
		  
		};
		u.getAllByCreater = function(createrID) {
		  return $http.get('api/forums/' + createrID).then(function(res){
		  	//console.log("returning data");
		  	//console.log(res.data);
		  	angular.copy(res.data, u.forum);
		  	//console.log(u.forum);
		  	return u.forum;
		  });
		};
		u.create = function(forum) {
		    var b = $http.post('/builder', forum).success(function(data){
		    	//console.log("Forum Build Success");
		    	$window.location.href = '/'+ forum.url;
		    });
		  return b;
		  };
		return u;

	}])

// .filter('postOrderBy', function () {
//    return function (arr) {

//    	console.log("custom sort");
//    	console.log(arr);

//      var numbers = [];
//      var newWorldOrder = [];

// 			return arr.sort(
// 				(function(index){
// 				    return function(a, b){
// 				    	console.log("a");
// 				    	console.log(a);
// 				    	console.log(a.comments);
// 				        return (a[index] === b[index] ? 0 : (a[index] < b[index] ? -1 : 1));
// 				    };
// 				})(3)
// 			); // 2 is the index
//         //return numbers.sort().concat(newWorldOrder);
//      };
// })

.directive('wcUnique', ['uniqueService', function (uniqueService) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
        	element.bind('keyup', function (e) {
                if (!ngModel || !element.val()) return;
                var keyProperty = scope.$eval(attrs.wcUnique);
                var currentValue = element.val();
                //console.log(keyProperty);
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
                        	if (typeof unique !== 'undefined') {
                        		if(scope.buildForum.comname.$dirty == true){
									scope.buildForum.comname.$setValidity('unique', unique);
                        		}else{
									scope.buildForumWU.comname.$setValidity('unique', unique);
                        		}
                        		
                        		
                        	}
                            ngModel.$setValidity('unique', unique);
                        }
                        
                    }, function () {
                        //Probably want a more robust way to handle an error
                        //For this demo we'll set unique to true though
                        ngModel.$setValidity('unique', true);
                    });
                }
                if(keyProperty.property=='forumfirst'){
                	//set currentValue to scope comurl
                	currentValue = scope.comurl;
                	uniqueService.checkForum(currentValue)
                    .then(function (unique) {
                        //Ensure value that being checked hasn't changed
                        //since the Ajax call was made
                        if (currentValue == element.val()) { 
                        	// if (typeof unique !== 'undefined') {
                        	// 	scope.comurl.$setValidity('unique', unique);
                        	// } else{
                        	// 	 ngModel.$setValidity('unique', unique);
                        	// }
                        	ngModel.$setValidity('unique', unique);
                        	//scope.comurl.$setValidity('unique', unique);
                           
                        }else{
                        	console.log("danger");
                        }
                    }, function () {
                        ngModel.$setValidity('unique', true);
                    });
                }
                
            });
		}
    }
}])



	.controller('MainCtrl', 
		['$scope', '$timeout', '$filter', '$location', '$moment', 'forum', 'posts', 'user', 
			function($scope, $timeout, $filter, $location, $moment, forum, posts, user){
				// console.log("scope");
				// console.log($scope);
			  $scope.user = user.user.username;

			  $scope.test = 'Hello world!';

			  $scope.posts = posts.posts;
			  $scope.forum = forum.forum;

			  $scope.relDate = function(bomb){
					console.log("Meow: " + bomb);
					if(bomb=="Hour"){
						x = new moment();
						z = x.clone().add('hours',1);
						$scope.exdate = z;
					}
					else if(bomb=="Day"){
						x = new moment();
						z = x.clone().add('days',1);
						$scope.exdate = z;
					}else if(bomb=="Month"){
						x = new moment();
						z = x.clone().add('months',1);
						$scope.exdate = z;
					}else if(bomb=="Minute"){
						x = new moment();
						z = x.clone().add('minute',2);
						$scope.exdate = z;
					}else{
						$scope.exdate = null;
					}
				  	
				  };	

				$scope.findActive = function(poster){
					//console.log(poster._id);
				  	//console.log($location.path());
				  	var n = $location.path().lastIndexOf('/');
					var result = $location.path().substring(n + 1);
					//console.log(result);
				  	//.substr(0, path.length)
					if (result == poster._id) {
				      return "active";
				    } else {
				      return "";
				    }
				  	
				  };	  	

			  $scope.dateMaster = function(date){
			  	var today = new Date();
			  	var today2 = $filter('date')(today, "dd/MM/yyyy");
			  	var date2 = $filter('date')(date, "dd/MM/yyyy");
			  	if(date2 === today2){

			  		var date3 = $filter('date')(date, "h:mma");
			  		//console.log(date3);
			  		return date3.toLowerCase();
			  	}

			  	var date11 = $filter('date')(date, "shortDate");
			  	//console.log(date2);
			  	return date11;
			  };

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
			  	if($scope.title === '') { return; }
			  	posts.create({
						title: $scope.title,
						link: $scope.link,
						bode: $scope.bode,
						expirationdate: $scope.exdate,
						forumtype: forumtypeid
					}).success(function(post) {
						$scope.forum.posts.push(post);
						$location.path(forum.forum.url);
				  });
     			
				$scope.title = '';
				$scope.bode = '';
				$scope.link = '';
				$scope.exdate = '';
			  }

			  	var n = $location.path().lastIndexOf('/');
				var result = $location.path().substring(n + 1);
				$scope.location = result;
				//console.log("current location");
				//console.log($location);
				var lo = $location.$$path.indexOf("posts") > -1;
				var lo2 = $location.$$path.indexOf("post") > -1;
				//console.log("lo: " + lo);
				//console.log("lo2: " + lo2);

				$scope.hideShit = function(){
					$('.info-wrapper').removeClass('info-wrapper').addClass('info-wrapper post-mode');
					$('.sidebar-wrapper').removeClass('sidebar-wrapper').addClass('sidebar-wrapper post-mode');
					return "hideShit";
				}

				$scope.showShit = function(){
					

					$('.info-wrapper.post-mode').removeClass('post-mode');
					$('.sidebar-wrapper.post-mode').removeClass('post-mode');
					return "showShit";
				}

				$scope.infoSelector = function(){
					if(lo||lo2){
						$('.sidebar-wrapper').removeClass('sidebar-wrapper').addClass('sidebar-wrapper post-mode');
						return 'info-wrapper post-mode';
					}else{
						return 'info-wrapper';
					}
				}

			}
		]
	)
	.controller('ProfileCtrl',
		['$scope', 'user', 'forum', function($scope, user, forum){
			// Get User
			$scope.user=user.user;
			// Get All Forums by this user
			if (typeof user.user._id !== 'undefined') {
				forum.getAllByCreater(user.user._id).then(function(data) {
	            	$scope.userforums = data;
	        	});
			}
			$scope.isLoggedIn = function() {
				if (typeof user.user.username != 'undefined')
				  return true;
				else 
				  return false;
				};
		}]
	)
	.controller('AccessCtrl',
		['$scope', '$stateParams', 'user', 'access',  function($scope, $stateParams, user, access){
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
					if(data==0001){
						$scope.wrongcode = true;
					}
				  });
		     }
		}]
	)
	.controller('ForumCtrl',
		['$scope', 'user', 'forum', function($scope, user, forum){
			$scope.user = user.user.username;
			  $scope.isLoggedIn = function() {
				if (typeof user.user.username != 'undefined')
				  return true;
				else 
				  return false;
				};
		}]
	)
	.controller('HomeCtrl',
		['$scope', 'user', 'forum', function($scope, user, forum){
			forum.getAllForums().then(function(data) {
	            $scope.forum = data.data;
	        });
		}]
	)
	.controller('BuildCtrl',
		['$scope', '$timeout', '$location', 'forum',  'user', function($scope, $timeout, $location, forum, user){
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
		      }
		      $scope.changeRoute = function(url, forceReload) {
			        $scope = $scope || angular.element(document).scope();
			        if(forceReload || $scope.$$phase) { 
			            window.location = url;
			        
			        } else {
			            $location.path(url);
			            $scope.$apply();
			        }
			    };
		      
		}]
	)
	.controller('PostsCtrl', 
		['$scope', '$location', '$sce', 'forum', 'posts', 'post',
			function($scope, $location, $sce, forum, posts, post){

				var n = $location.path().lastIndexOf('/');
				var result = $location.path().substring(n + 1);
				$scope.location = result;
				var lo = $location.$$path.indexOf("posts") > -1;

				// WE NEED TO CHANGE THE info-wrapper CLASS to info-wrapper-post
				$('.info-wrapper').removeClass('info-wrapper').addClass('info-wrapper post-mode');
				$('.sidebar-wrapper').removeClass('sidebar-wrapper').addClass('sidebar-wrapper post-mode');

				$scope.infoSelector = function(){
					if(lo){
						return 'info-wrapper-post';
					}else{
						return 'info-wrapper';
					}
				}

				$scope.showShit = function(){
					$('.info-wrapper.post-mode').removeClass('post-mode');
					$('.sidebar-wrapper.post-mode').removeClass('post-mode');
					return "showShit";
				}

				$scope.post = post;

				$scope.forum = forum.forum;

				$scope.post.bode = $sce.trustAsHtml(post.bode);

				for (var i = post.comments.length - 1; i >= 0; i--) {
				    $scope.post.comments[i].body = $sce.trustAsHtml(post.comments[i].body);
				}

				//$scope.post.comments.body = $sce.trustAsHtml(post.comments.body);
				$scope.edit2 = {
			        inlineMode : ["true"],
			        placeholder: ['Reply Here ...']
			    }

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
					  	if($scope.body === '') { return; }
					  	
						posts.editCom({
							body: $scope.body
						}, comment._id).success(function(post) {
							$scope.body = '';
							$scope.isEdit = null;
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
				  		return true;
					}
				  	
				}

				  	 $scope.editPost = function(postid, forumurl){
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
	)
	.directive('perfectScrollbar',
	  ['$parse', '$window', function($parse, $window) {
	  var psOptions = [
	    'wheelSpeed', 'wheelPropagation', 'minScrollbarLength', 'useBothWheelAxes',
	    'useKeyboard', 'suppressScrollX', 'suppressScrollY', 'scrollXMarginOffset',
	    'scrollYMarginOffset', 'includePadding'//, 'onScroll', 'scrollDown'
	  ];

	  return {
	    restrict: 'EA',
	    transclude: true,
	    template: '<div><div ng-transclude></div></div>',
	    replace: true,
	    link: function($scope, $elem, $attr) {
	      var jqWindow = angular.element($window);
	      var options = {};

	      for (var i=0, l=psOptions.length; i<l; i++) {
	        var opt = psOptions[i];
	        if ($attr[opt] !== undefined) {
	          options[opt] = $parse($attr[opt])();
	        }
	      }

	      $scope.$evalAsync(function() {
	        $elem.perfectScrollbar(options);
	        var onScrollHandler = $parse($attr.onScroll)
	        $elem.scroll(function(){
	          var scrollTop = $elem.scrollTop()
	          var scrollHeight = $elem.prop('scrollHeight') - $elem.height()
	          $scope.$apply(function() {
	            onScrollHandler($scope, {
	              scrollTop: scrollTop,
	              scrollHeight: scrollHeight
	            })
	          })
	        });
	      });

	      function update(event) {
	        $scope.$evalAsync(function() {
	          if ($attr.scrollDown == 'true' && event != 'mouseenter') {
	            setTimeout(function () {
	              $($elem).scrollTop($($elem).prop("scrollHeight"));
	            }, 100);
	          }
	          $elem.perfectScrollbar('update');
	        });
	      }

	      // This is necessary when you don't watch anything with the scrollbar
	      $elem.bind('mouseenter', update('mouseenter'));

	      // Possible future improvement - check the type here and use the appropriate watch for non-arrays
	      if ($attr.refreshOnChange) {
	        $scope.$watchCollection($attr.refreshOnChange, function() {
	          update();
	        });
	      }

	      // this is from a pull request - I am not totally sure what the original issue is but seems harmless
	      if ($attr.refreshOnResize) {
	        jqWindow.on('resize', update);
	      }

	      $elem.bind('$destroy', function() {
	        jqWindow.off('resize', update);
	        $elem.perfectScrollbar('destroy');
	      });

	    }
	  };
	}]);