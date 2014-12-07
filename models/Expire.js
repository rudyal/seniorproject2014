var mongoose = require('mongoose');

var ExpireSchema = new mongoose.Schema({
  type: String,
  type_Id: String,
  expirationdate: { type: Date}
});




mongoose.model('Expire', ExpireSchema);