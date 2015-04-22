var mongoose = require('mongoose');

var ForumTypeSchema = new mongoose.Schema({
  title: String,
  url: String,
  access: String,
  allowanon: Boolean,
  allowreg: Boolean,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  forumcategory: [{type: mongoose.Schema.Types.ObjectId, ref: 'ForumCategory' }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});


mongoose.model('ForumType', ForumTypeSchema);