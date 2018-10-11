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

The story is that we have a garage with one car and several bikes. 

**The Data Structure**


The Garage Schema has: 
 - one nested Car model,
 - a bikeCount prop which tracks the number of bike refs leading back to garage
 - a nested array of tool schemas
 
The Bike Schema has:
  - a ref back to the garage which "owns" the bike
  
The Tool Schema has:
  - no refs to anything. It is encapsulated within a Garage Shcema (object) 


**When the app is done it should be able to:**

1. Create a new garage. This is pretty straightforward, and we won't focus on making/deleting top
level schemas.

2. Add or replace the car in the garage without throwing errors.

3. Modify the array of bikes by adding, removing, or updating elements of the array without throwing errors.

4. Add and remove tools as complete subdocs from the tools array.


**Configuration:**

The app is meant to be run in node.

Dependencies are: Express, Mongodb, Mongoose, and Body Parser.

Mongo will run in the development environment at localhost at 'mongodb://localhost:27017/NestedSchemas'.

Mongoose will use native ES6 promises.

Schemas are defined in the 'model...' files.

**Files in the App**

1. app.js ---> starting point, location of express server

2. config.js ---> environment variable config and mongoose configuration

3. modelGarage.js ---> the top level schema

4. modelCar.js ---> the single nested model

5. modelBike.js ---> tracked by refs

6. modelTool.js ---> the array nested schema

7. notes.html ---> notes I took, links to docs or stackoverlflow



**Unit Testing**
Unit tests are built on
 - Mocha
 - Expect (pre-Jest)
 - SuperTest 
 
 Mongo will run in the test environment at localhost at 'mongodb://localhost:27017/NestedSchemasTest'.
 
 You can set the tests to run until you change something by running "npm run test-watch"
 
 These are the first unit tests I've written from scratch. 
 
 



