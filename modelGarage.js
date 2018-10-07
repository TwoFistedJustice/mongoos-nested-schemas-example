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
  // there is little reason to have an array of pointers here
  // we can store the garage id along with each bike in the bikes table and just
  // keep a count of the bikes here, occasionally syncing them
  // by finding all bikes and comparing the counts
  // bikes: [
  //   {
  //   type: ObjectId,
  //   ref: 'Bike'
  // }
  // ]
bikeCount: {
    type: Number,
    default: 0
}
});

const Garage = mongoose.model('Garage', garageSchema);
module.exports = {Garage};