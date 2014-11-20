var mongoose = require('mongoose');

var ForumTypeSchema = new mongoose.Schema({
  title: String,
  url: String,
  access: String,
  allowanon: Boolean,
  allowreg: Boolean,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

//May need a url checker

mongoose.model('ForumType', ForumTypeSchema);