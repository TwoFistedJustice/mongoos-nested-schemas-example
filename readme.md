**How to Use Mongoose Nested Schemas**

The goal is to build a simple working example of a Express/Mongodb/Mongoose stack
that uses Mongoose nested schemas.

**The Story**
The story is that we have a garage with one car and several bikes. All we care about the 
vehicles is what their color is.

**The Data Structure**
The Garage schema has one nested Car schema,and a nested array of Bike schemas.


**When the app is done it should be able to:**

Create a new garage. This is pretty straightforward, and we won't focus on making/deleting top
level schemas.

Add or replace the car in the garage without throwing errors.

Modify the array of bikes by adding, removing, or updating elements of the array without throwing errors.


**Configuration:**
Dependencies are: Express, Mongodb, Mongoose, and Body Parser.

Mongo will run on localhost at 'mongodb://localhost:27017/nested'.

Mongoose will use native ES6 promises.

Schemas are defined in the 'model...' files.

**Files in the Repo**

app.js ---> starting point, location of express server

mongooseConfig.js ---> four lines to make Mongoose kill cobras.

modelGarage.js ---> the top level schema
modelCar.js ---> the single nested schema
modelBike.js ---> the array nested schema





