var mongoose = require('mongoose');
var User =  mongoose.model('User');
var path = require('path'),
    fs = require('fs');

module.exports = function(app, passport) {

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') }); 
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// process the login form
	// app.post('/login', do all our passport stuff here);

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {

	}), signUpFields);

	function signUpFields(req, res, next) {
		 // console.log("h");
		 // console.log(req.user._id);

		User.findById(req.user._id, function(err, id) {
		  if (!id)
		    return next(new Error('Could not load Document'));
		  else {
		    // do your updates here
		    console.log(req.files);

		    var tempPath = req.files.file,
		        targetPath = path.resolve('/public/tmp/image.jpg');

		    if(typeof req.files.file != 'undefined'){
		    	var type = ['.jpg', '.png', '.bmp']
		    	//if (path.extname(req.files.file.name).toLowerCase() === '.jpg') {
		    	if (type.indexOf(path.extname(req.files.file.name).toLowerCase()) > -1) {
				        //fs.rename(tempPath, targetPath, function(err) {
				            if (err) throw err;
				            console.log("Upload completed!");
				            id.profilepic = req.files.file.name;
				       // });
				    } else {
				    	console.log("only pictures allowed");
				        // fs.unlink(tempPath, function () {
				        //     if (err) throw err;
				        //     console.error("Only picture files are allowed!");
				        // });
				    }
		    }
		    

		    id.username = req.body.username;
		    id.updated = new Date;
		    id.datejoined = new Date;
		    id.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

		    id.save(function(err) {
		     // if (err)
		       // console.log('error')
		     // else
		       // console.log('success')

		    res.redirect('/');
		    });
		  }
		});

	}

	// process the signup form
	// app.post('/signup', do all our passport stuff here);

	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	


	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// app.get('/',
	//   // Authenticate using HTTP Basic credentials, with session support disabled,
	//   // and allow anonymous requests.
	//   passport.authenticate(['basic', 'anonymous'], { session: false }),
	//   function(req, res){
	//     if (req.user) {
	//       res.json({ username: req.user.username, email: req.user.email });
	//     } else {
	//       res.json({ anonymous: true });
	//     }
 //    });



};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}