var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var user =  mongoose.model('User');
var ForumType =  mongoose.model('ForumType');
var Expire =  mongoose.model('Expire');
var Comment = mongoose.model('Comment');
var ObjectId = require('mongoose').Types.ObjectId; 
//var access = require('context-access');


//unique email
router.get('/api/unemail/:unemail', function(req, res, next) {
  console.log(req.params.unemail);
    user
    .find({'local.email': req.params.unemail })
    .limit(20)
    .exec(function(err, user){
      if(err){ return next(err); }
      if(user.length > 0){
        // not unique
        res.json(user);
      }else{
        //console.log(user);
        res.json(user);
      }
    });
});
//unique username
router.get('/api/unuser/:unusername', function(req, res, next) {
  console.log(req.params.unemail);
    user
    .find({'username': req.params.unusername })
    .limit(20)
    .exec(function(err, user){
      if(err){ return next(err); }
      if(user.length > 0){
        // not unique
        res.json(user);
      }else{
        //console.log(user);
        res.json(user);
      }
    });
});
//unique forum
router.get('/api/unforum/:unforum', function(req, res, next) {
  console.log(req.params.unforum);
    ForumType
    .find({url: req.params.unforum })
    .limit(20)
    .exec(function(err, forum){
      if(err){ return next(err); }
      if(forum.length > 0){
        // not unique
        //console.log(forum);
        res.json(forum);
      }else{
        //console.log(forum);
        res.json(forum);
      }
    });
});

/* GET home page. */
router.get('/', function(req, res) {
  console.log("homepage ejs");
  res.render('homepage.ejs', { title: 'Express' });
});
router.get('/popular', function(req, res) {
  console.log("homepage ejs");
  res.render('homepage.ejs', { title: 'Express' });
});
router.get('/locked', function(req, res, next) {
    //req.params.createrID
    console.log("lockede ejs");
    res.render('locked.ejs', { title: 'Access Code Required' });
});
router.get('/locked/:murl', function(req, res, next) {
    //req.params.createrID
    console.log("lockede ejs");
    res.render('locked.ejs', { title: 'Access Code Required' });
});

router.post('/api/locked', function(req, res, next) {
    //req.params.createrID
    console.log("API lockede ejs");
    //console.log(req);
    //console.log(req.body);

    // Get forum access code, where forumurl = req.body.murl
     ForumType
        .findOne({ url: req.body.murl })
        .exec(function (err, forumtype) {
          if(req.body.access == forumtype.access){
            console.log("CORRRECTTT");
            // Set a friggin cookie
            var code = forumtype.access + forumtype.url;
            res.cookie('accesscode', code, {  maxAge: 900000000, httpOnly: true  });
            // return 200
            res.status(200).json({"correct": "correct", "murl": forumtype.url});

          }else{
            // return 500
            res.status(500).json({"error": "0001", "URL": forumtype.url});
            // message saying incorrect 
          }
    });
});

/* GET home page. */
router.get('/builder', function(req, res) {
  //if (req.currentUser) {
        // logged in
        res.render('builder.ejs', { title: 'Build a forum' });
    
  
});

router.get('/forums', function(req, res, next) {

  ForumType
    .find()
    .exec(function(err, forumtype){
      if(err){ return next(err); }
      //console.log(posts);
        res.json(forumtype);
    });
});

router.get('/api/forums/:createrID', function(req, res, next) {

    ForumType
    .find({ user: ObjectId(req.params.createrID) })
    .exec(function(err, forumtype){
      if(err){ return next(err); }
      //console.log(posts);
        res.json(forumtype);
    });

});


router.post('/builder', function(req, res, next) {
  var forumType = new ForumType(req.body);
  // ref user for post table
 console.log(forumType);
    
  if(req.user._id != 'undefined'){
    forumType.user = req.user;
  }else{
    forumType.user = null;
    console.log("User is Null");
  }
  var myPath;
  forumType.save(function(err, forumType){
    if(err){ return next(err); }
    
     var myPath = "/" + forumType.url;
     
     console.log(myPath);

    res.json(forumType);
    //res.redirect(myPath);
    //res.redirect(302, myPath);
    //302

  });

  

});


router.get('/chat', function(req, res) {

console.log("here111");
  //passport.use(new LocalStrategy(
    //function(username, password, done) {
      console.log(req.user);
      
        console.log("here1");
        //if (err) { return done(err); }
        if (req.user) {
          // user.findOne({ username: req.user.username }, function(err, user) {
          //    if (!user) {
          //     return done(null, false, { message: 'Incorrect username.' });
          //   }
          //   if (!user.validPassword(req.user.password)) {
          //     return done(null, false, { message: 'Incorrect password.' });
          //   }
            res.json({ name: req.user.username });
         // });
        }else{
          console.log("here");
          res.json({ name: 'anonymous' });
        }
        
      
  //  }
  //));


  //res.render('chat.ejs', { title: 'Express' });
});


router.get('/posts', function(req, res, next) {

  Post
    .find()
    .populate('user')
    .exec(function(err, posts){
      if(err){ return next(err); }
      //console.log(posts);
        res.json(posts);
    });
});

// router.get('/profile', isLoggedIn2, function(req, res) {
//     // res.render('profile.ejs', {
//     //   user : req.user // get the user out of session and pass to template
//     // });
//       res.json(req.user);
//   });

router.get('/api/profile', isLoggedIn2, function(req, res) {
    // res.render('profile.ejs', {
    //   user : req.user // get the user out of session and pass to template
    // });
      res.json(req.user);
  });

  // route middleware to make sure a user is logged in
function isLoggedIn2(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}





router.put('/posts/:post/upvote', function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error("can't find post")); }

    req.post = post;
    return next();
  });
});

router.get('/posts/:post', function(req, res, next) {

     req.post
      .populate('user')
      .populate('comments', function(err, post) {

        if (err) return res.json(err);

        req.post.populate({
          path: 'comments.user',
          model: user
        }, function (err, post2) {
          console.log(post2);
          res.json(post2);
        });
      });  
});

router.post('/posts/edit/:id', function(req, res, next) {
  var myID = req.params.id;
    
      Post.findById(myID, function (err, post) {
          if (typeof req.user == 'undefined') { return "Edit your own";}

          console.log("POST USER");
          console.log(post.user);
          var postUser = parseInt(post.user);

          console.log("REQ USER");
          console.log(req.user._id);
          var reqUser = parseInt(req.user._id);

          if (reqUser == postUser) { 
            console.log("same Guy");
            post.update({ title: req.body.title, bode: req.body.bode }).exec(res.json(post));
          }else{
            console.log("not same guy");
            return "e";
          }
      });
});

router.post('/comments/edit/:id', function(req, res, next) {
  var myID = req.params.id;
  console.log(myID);
    
      Comment.findById(myID, function (err, comment) {
          if (typeof req.user == 'undefined') { return "Edit your own";}

          console.log("POST USER");
          console.log(comment.user);
          var postUser = parseInt(comment.user);

          console.log("REQ USER");
          console.log(req.user._id);
          var reqUser = parseInt(req.user._id);

          if (reqUser == postUser) { 
            console.log("same Guy");
            console.log(req.body);
            console.log(req.body.body);
            comment.update({ body: req.body.body }).exec(res.json(comment));
          }else{
            console.log("not same guy");
            return "e";
          }
      });
});

router.delete('/posts/delete/:id', function(req, res, next) {
  var myID = req.params.id;
  console.log("deleteing");
  console.log(myID);
    
      Post.findById(myID, function (err, post) {
          if (typeof req.user == 'undefined') { return "Edit your own";}

          console.log("POST USER");
          console.log(post.user);
          var postUser = parseInt(post.user);

          console.log("REQ USER");
          console.log(req.user._id);
          var reqUser = parseInt(req.user._id);

          if (reqUser == postUser) { 
            console.log("same Guy");
            post.remove(function (err, post) { return res.json(post); });
          }else{
            console.log("not same guy");
            return "e";
          }
      });
});

router.post('/posts', function(req, res, next) {
  var post = new Post(req.body);
  var FT = new ForumType();
  // ref user for post table
  //console.log(req);
  ForumType
        .findOne({ _id: post.forumtype })
        .populate('posts')
        .exec(function (err, forumtype) {

          if (err) { return next(err); }

            if (typeof req.user !== 'undefined') {
              if (typeof req.user._id !== 'undefined') {
                post.user = req.user;
                //console.log(post.user);
                console.log("col1");
              }else{
                console.log("col2");
                //Can set User here

                //Maybe call a function that create anonymous user ex. "anon-4523452", then set set session with that, returns user_id
                post.user = ObjectId("54839caf1ea7c61425e29756");
              }
              
            }else{
              console.log("col2");
              //Can set User here
              post.user = ObjectId("54839caf1ea7c61425e29756");
            }

            post.save(function(err, post){
              if(err){ return next(err); }
              forumtype.posts.push(post);
              forumtype.save(function(err, forumtype) {
                res.json(post);
              });
                //res.json(post);
            });

        });
        if (typeof post.expirationdate !== 'undefined') {
          console.log("ex Date is: ");
          console.log(post.expirationdate);
          // insert data into another model
          var expire = new Expire();

            expire.type = "Posts";
            expire.type_Id = post._id;
            expire.expirationdate = post.expirationdate;

            expire.save(function(err, expire){
              
            });
        }

  console.log("post id is: ");
  console.log(post._id);

});


router.post('/posts/:post/comments', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;
  
  // if(req.user._id != 'undefined'){
  //   comment.user = req.user;
  // }
          if (typeof req.user !== 'undefined') {
              if (typeof req.user._id !== 'undefined') {
                comment.user = req.user;
                //console.log(post.user);
                console.log("col1");
              }else{
                console.log("col2");
                //Can set User here

                //Maybe call a function that create anonymous user ex. "anon-4523452", then set set session with that, returns user_id
                comment.user = ObjectId("54839caf1ea7c61425e29756");
              }
              
            }else{
              console.log("col2");
              //Can set User here
              comment.user = ObjectId("54839caf1ea7c61425e29756");
            }

  comment.save(function(err, comment){
    if(err){ return next(err); }


    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });


  });
});

router.get('/access/:murl', function(req, res) {
  res.send("hellooo " + req.params.murl );
});

router.get('/api/:murl', function(req, res, next) {


    //console.log(req.params.murl);
    var myPath = req.params.murl;
    // if( myPath.charAt( 0 ) === '/api' ){
    //   myPath = myPath.slice( 1 );
    // }
    console.log("mongoose");
    //console.log(myPath);

      ForumType
        .findOne({ url: myPath })
        .populate('posts')
        .exec(function (err, forumtype) {
          // console.log("forumtyp");
          // console.log(forumtype);
          // console.log("access");
          // console.log(forumtype.access);
          // console.log(forumtype.allowanon);
          // console.log(forumtype.allowreg);

          var access = 3403;
          var redirectGuy = false;

          // CHECK ACCESS CODE
          if(forumtype.access != null){
            if(typeof forumtype.access != 'undefined'){
            // First we need to init anon users IDK DROP a Cookie??
            // Maybe drop the cookie in collections function?? then check here
            
            //res.clearCookie('accesscode');
            //res.clearCookie('tobi');
            //console.log(req.cookies.accesscode);

              // If so, check if access code is set as param
              var code = forumtype.access + forumtype.url;
              if(req.cookies.accesscode == code){
                console.log("settt");
              }else{
                //console.log("redirect 1");
                //console.log(forumtype.url);
                return res.status(500).json({"error": "0001", "URL": forumtype.url});
                next();
              }
            }
          }
          // DO NOT DELETE YET
          // if(typeof forumtype.allowanon == 'undefined'){
          //   // Forum does not allow anonymous users
          //     // If user is not logged in redirect to login or register page

          //      if (typeof req.user !== 'undefined') {
          //       if (typeof req.user._id !== 'undefined') {
          //         post.user = req.user;
          //         //console.log(post.user);
          //         console.log("col1");
          //       }else{
          //         console.log("redirect 2");
          //         return res.status(500).json({"error": "0002", "URL": forumtype.url});
          //         next();
          //       }
          //     }else{
          //       console.log("redirect 3");
          //       var return_array = ['0002', forumtype.url];
          //       return res.status(500).json({"error": "0002", "URL": forumtype.url});
          //       //return res.status(500).send('0002');
          //       next();
          //     }

          // }
          // if(typeof forumtype.allowreg !== 'undefined'){
          //   // Forum only allows anonymous users
          //     // We should prolly only need to check this when posting and set user to anon
          // }

          // CHECK ALLOW ANON USERS

         



          
            if (err) return handleError(err);
            if(forumtype!=null){
              console.log("forumtype");
              //console.log(forumtype);
              req.forumtype = forumtype;

            req.forumtype.populate({
              path: 'posts.user',
              model: user
            }, function (err, forumtype) {
                  if(err){ return next(err); }

                  req.forumtype.populate({
                    path: 'posts.comments',
                    model: Comment
                  }, function (err, forumtype) {
                      res.json(req.forumtype);

                    });


                    //res.json(req.forumtype);

              });
              // req.forumtype.populate('posts.user').save(function(err, forumtype) {
              //   if(err){ return next(err); }

              //   res.json(req.forumtype);
              // });
            }else{
              res.redirect('/');
            }

    });


    
});

router.post('/*/posts', function(req, res, next) {

    var myPath = req.url;
      if( myPath.charAt( 0 ) === '/' ){
        myPath = myPath.slice( 1 );
        myPath = myPath.substring(0, myPath.length - 6);
      }

    ForumType
        .findOne({ url: myPath })
        .exec(function (err, forumtype) {
          console.log(forumtype);
          if (err) return handleError(err);
          if(forumtype!=null){
            

              var post = new Post();
              post.forumtype = forumtype._id;

              post.title = req.body.title;
              console.log(req.body);
              console.log(post);
              forumtype.posts.push(post);
              //forumtype.posts=(post);
              console.log(forumtype);

              forumtype.save();

              post.save(function(err, post){
                if(err){ return next(err); }

                
                
                res.json(post);
              });


          }else{
            res.redirect('/');
          }
          
        })  



});



module.exports = router;
