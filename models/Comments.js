var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
	body: String,
	upvotes: {type: Number, default:0},
	date: { type: Date, default: Date.now },
	post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

CommentSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

mongoose.model('Comment', CommentSchema);