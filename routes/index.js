var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var user =  mongoose.model('User');
var ForumType =  mongoose.model('ForumType');
var Comment = mongoose.model('Comment');


/* GET home page. */
router.get('/', function(req, res) {
  console.log("homepage ejs");
  res.render('homepage.ejs', { title: 'Express' });
});
router.get('/popular', function(req, res) {
  console.log("homepage ejs");
  res.render('homepage.ejs', { title: 'Express' });
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


router.post('/builder', function(req, res, next) {
  var forumType = new ForumType(req.body);
  // ref user for post table
 
    
  if(req.user._id != 'undefined'){
    forumType.user = req.user;
  }else{
    forumType.user = null;
    console.log("User is Null");
  }
  var myPath;
  forumType.save(function(err, forumType){
    if(err){ return next(err); }
    console.log(forumType.url);
     var myPath = "/" + forumType.url;
     
     console.log(myPath);

    res.json(forumType);
    //res.redirect(myPath);
    //res.redirect(302, myPath);
    //302

  });

  

});

router.get('/chat', function(req, res) {
  res.render('chat.ejs', { title: 'Express' });
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

router.get('/profile', isLoggedIn2, function(req, res) {
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


router.post('/posts', function(req, res, next) {
  var post = new Post(req.body);
  var FT = new ForumType();
  // ref user for post table
  console.log(req);



  ForumType
        .findOne({ _id: post.forumtype })
        .populate('posts')
        .exec(function (err, forumtype) {

            if(req.user._id != 'undefined'){
              post.user = req.user;
            }else{
              post.user = null;
            }

            post.save(function(err, post){
              if(err){ return next(err); }
              forumtype.posts.push(post);
              forumtype.save(function(err, forumtype) {
                res.json(post)
              });
                //res.json(post);
            });

        });

  console.log(post);
  console.log("ForumType is: ");
  console.log(ForumType);
  console.log("FT is: ");
  console.log(FT);





});


router.post('/posts/:post/comments', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;
  
  if(req.user._id != 'undefined'){
    comment.user = req.user;
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

router.get('/api/:murl', function(req, res) {

    console.log(req.params.murl);
    var myPath = req.params.murl;
    // if( myPath.charAt( 0 ) === '/api' ){
    //   myPath = myPath.slice( 1 );
    // }
    console.log("mongoose");
    console.log(myPath);

      ForumType
        .findOne({ url: myPath })
        .populate('posts')
        .exec(function (err, forumtype) {

          if (err) return handleError(err);
          if(forumtype!=null){
            console.log("forumtype");
            console.log(forumtype);
            req.forumtype = forumtype;

          req.forumtype.populate({
            path: 'posts.user',
            model: user
          }, function (err, forumtype) {
                if(err){ return next(err); }
                res.json(req.forumtype);
              
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
