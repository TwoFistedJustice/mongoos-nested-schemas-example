/*

 Using NODE_ENV in this way is bad practice IRL apps
 https://codeburst.io/process-env-what-it-is-and-why-when-how-to-use-it-effectively-505d0b2831e7
 
 */

const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
 process.env.port = 3000;
 process.env.MONGODB_URI = 'mongodb://localhost:27017/NestedSchemas';
} else if (env === 'test') {
  process.env.port = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/NestedSchemasTest'
}

