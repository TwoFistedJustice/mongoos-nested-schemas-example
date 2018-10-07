const mongoose = require('mongoose');
const {Schema} = mongoose;
const {ObjectId} = Schema.Types;
const {Car} = require('./modelCar');

const garageSchema  = new Schema({
  name: {
    type: String,
    required: true
  },
  // garage can store one car
  cars: {
    type: ObjectId,
    ref: 'Car'
  },
  bikes: []

});

const Garage = mongoose.model('Garage', garageSchema);
module.exports = {Garage};