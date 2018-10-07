const mongoose = require('mongoose');
const {Schema} = mongoose;

const carSchema  = new Schema({
  color: {
    type: String,
    required: true
  }
});

const Car = mongoose.model('Car', carSchema);
module.exports = {Car};