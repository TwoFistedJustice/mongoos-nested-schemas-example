const mongoose = require('mongoose');
const {Schema} = mongoose;
const {ObjectId} = Schema.Types;
const {Car} = require('./modelCar');
const {Bike} = require('./modelBike');

const garageSchema  = new Schema({
  name: {
    type: String,
    required: true
  },
  // garage can store one car
  car: {
    type: ObjectId,
    ref: 'Car'
  },
  bikes: [
    {
    type: ObjectId,
    ref: 'Bike'
  }
  ]

});

const Garage = mongoose.model('Garage', garageSchema);
module.exports = {Garage};