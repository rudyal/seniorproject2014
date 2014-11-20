var mongoose = require('mongoose');

var ForumCategorySchema = new mongoose.Schema({
  title: String,
  description: String,
  forumtype: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumType' }
});

//May need a url checker


mongoose.model('ForumCategory', ForumCategorySchema);