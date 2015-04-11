var mongoose = require('mongoose');

var ContactSchema = new mongoose.Schema({
  contactData: String
});

//May need a url checker


mongoose.model('Contact', ContactSchema);