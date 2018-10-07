const mongoose = require('mongoose');
const {Schema} = mongoose;
const {ObjectId} = Schema;
const {Garage} = require('./modelGarage');

const carSchema  = new Schema({
  color: {
    type: String,
    required: true
  },
  // tracking where else this item is stored is necessary in order to find it later
  // it acts a foreign key
  owner: {
    type: ObjectId,
    ref: 'Garage'
  }
});

const Car = mongoose.model('Car', carSchema);
module.exports = {Car};