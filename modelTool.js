const mongoose = require('mongoose');
const {Schema} = mongoose;
const {ObjectId} = Schema;
const {Garage} = require('./modelGarage');

// no owner ref bc we want to store tools as subdocs of a garage

const toolSchema  = new Schema({
  toolName: {
    type: String,
    required: true
  },
  // tracking where else this item is stored is necessary in order to find it later
  // it acts a foreign key
  // owner: {
  //   type: ObjectId,
  //   ref: 'Garage'
  // }
});

// copied from Docs:
// https://mongoosejs.com/docs/subdocs.html#altsyntax
// toolSchema.pre('save', function (next) {
//   if ('invalid' == this.name) {
//     return next(new Error('#sadpanda'));
//   }
//   next();
// });


/*
*
* Since this schema is meant to be stored as a subdoc in an array of subdocs
* it looks like you have to export the schema and not the model.
* */
const Tool = mongoose.model('Tool', toolSchema);
module.exports = {toolSchema, Tool};
// module.exports = {toolSchema};