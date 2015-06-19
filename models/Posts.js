var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title: String,
  link: String,
  quality: String,
  date: { type: Date, default: Date.now },
  expirationdate: { type: Date},
  upvotes: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  bode: { type: String, default: 'neverborn' },
  type: { type: String },
  imagelink: { type: String},
  videolink: { type: String},
  linklink: { type: String},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  forumcategory: [{type: mongoose.Schema.Types.ObjectId, ref: 'ForumCategory' }],
  forumtype: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumType' }
});

mongoose.model('Post', PostSchema);