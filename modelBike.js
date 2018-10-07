const mongoose = require('mongoose');
const {Schema} = mongoose;
const {ObjectId} = Schema;
const bikeSchema = new Schema({
  color: {
    type: String,
    required: true
  },
  owner: {
    type: ObjectId,
    ref: 'Garage'
  }
});

const Bike = mongoose.model('Bike', bikeSchema);
module.exports = {Bike};