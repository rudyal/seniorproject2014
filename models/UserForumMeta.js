var mongoose = require('mongoose');

var UserForumMetaSchema = new mongoose.Schema({
  access: String,
  ispin: Boolean,
  isview: Boolean,
  isreport: Boolean,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

//May need a url checker


mongoose.model('UserForumMeta', UserForumMetaSchema);