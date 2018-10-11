/*

 Using NODE_ENV in this way is bad practice IRL apps
 https://codeburst.io/process-env-what-it-is-and-why-when-how-to-use-it-effectively-505d0b2831e7
 
 */
const env = process.env.NODE_ENV || 'development';
const devURI = 'NestedSchemas';
const testURI = 'NestedSchemasTest';

console.log(`env is set to ${env}`);
if (env === 'development') {
 process.env.port = 3000;
 process.env.MONGODB_URI = `mongodb://localhost:27017/${devURI}`;
} else if (env === 'test') {
  process.env.port = 3000;
  process.env.MONGODB_URI = `mongodb://localhost:27017/${testURI}`;
}

console.log(`Mongo URI set to: ${process.env.MONGODB_URI}`);

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });


module.exports = {mongoose};
