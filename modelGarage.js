const mongoose = require('mongoose');
const {Schema} = mongoose;
const {Car} = require('./modelCar');

const garageSchema  = new Schema({
  name: {
    type: String,
    required: true
  },
  // garage can store one car
  cars: {
    type: Schema.ObjectId,
    ref: 'Car'
  }

});

const Garage = mongoose.model('Garage', garageSchema);
module.exports = {Garage};