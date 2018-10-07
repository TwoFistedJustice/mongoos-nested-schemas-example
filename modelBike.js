const mongoose = require('mongoose');
const {Schema} = mongoose;
const bikeSchema = new Schema({
  color: {
    type: String,
    required: true
  }
});

const Bike = mongoose.model('Bike', bikeSchema);
module.exports = {Bike};