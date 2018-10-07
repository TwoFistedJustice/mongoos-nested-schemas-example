const mongoose = require('mongoose');
const {Schema} = mongoose;
const {ObjectId} = Schema;
const {Garage} = require('./modelGarage');

const carSchema  = new Schema({
  color: {
    type: String,
    required: true
  },
  owner: {
    type: ObjectId,
    ref: 'Garage'
  }
});

const Car = mongoose.model('Car', carSchema);
module.exports = {Car};