var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title: String,
  link: String,
  quality: String,
  date: { type: Date, default: Date.now },
  upvotes: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  bode: { type: String, default: 'neverborn' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  forumcategory: {type: mongoose.Schema.Types.ObjectId, ref: 'ForumCategory' },
  forumtype: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumType' }
});

PostSchema.methods.anon = function() {
  this.upvotes += 1;
  this.save(cb);
};

PostSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

mongoose.model('Post', PostSchema);