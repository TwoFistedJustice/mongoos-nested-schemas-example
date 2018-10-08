# How to Use Mongoose Nested Schemas

### What is Completed:

Add a garage

Add a car

Replace the car with a new car - sorry you only get to keep the most recent one.
 You liked the old one better??? Well you should have thought about that before 
 you clicked 'send'!
 
Add a bike. You can have as many bikes as you like. By the way I sold your old car
 and blew the money at the tables. 

The goal is to build a simple working example of a Express/Mongodb/Mongoose stack
that uses Mongoose nested schemas.


**The Story**

The story is that we have a garage with one car and several bikes. All we care about the 
vehicles is what their color is.

**The Data Structure**

The Garage schema has one nested Car schema,and a nested array of Bike schemas.


**When the app is done it should be able to:**

1. Create a new garage. This is pretty straightforward, and we won't focus on making/deleting top
level schemas.

2. Add or replace the car in the garage without throwing errors.

3. Modify the array of bikes by adding, removing, or updating elements of the array without throwing errors.


**Configuration:**

The app is meant to be run in node.

Dependencies are: Express, Mongodb, Mongoose, and Body Parser.

Mongo will run on localhost at 'mongodb://localhost:27017/nested'.

Mongoose will use native ES6 promises.

Schemas are defined in the 'model...' files.

**Files in the Repo**

1. app.js ---> starting point, location of express server

2. mongooseConfig.js ---> four lines to make Mongoose kill cobras.

3. modelGarage.js ---> the top level schema

4. modelCar.js ---> the single nested schema

5. modelBike.js ---> the array nested schema





