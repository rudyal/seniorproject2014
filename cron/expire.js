var CronJob = require('cron').CronJob;
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Expire =  mongoose.model('Expire');
var Post = mongoose.model('Post');

new CronJob('0 * * * * *', function(){
    console.log('Cron deleting expired posts');

    var now = new Date();
    console.log(now);

    var innerID = [];

    Expire.find({expirationdate: {"$lt": now}}, 
		function (err, expire) {
		    	console.log(expire);
		    	expire.forEach(function(expireone) { 
		    		innerID.push(expireone.type_Id); 
		    		console.log("here");
		    		console.log(expireone.type_Id);
		    		//we have the id, now remove the post from existence
		    		Post.findOne({ _id: expireone.type_Id }).remove().exec(
		    			Expire.find({expirationdate: {"$lt": now}}).remove().exec()
		    		);
		    		
		    	});
		    	//innerID[] = expire.type_Id;
		    	console.log(innerID);
		    	
	});

}, null, true, "America/Los_Angeles");
