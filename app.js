const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./mongooseConfig');
const {ObjectID} = require('mongodb');

const app = express();

const {Garage} = require('./modelGarage');
const {Car} = require('./modelCar');
const {Bike} = require('./modelBike');

app.use(bodyParser.json());


//define a route to put a Garage in the db
app.post('/garage', (req, res) => {
  let garage = new Garage({name: req.body.name});
  
  garage.save()
     .then((doc) => {
       res.send(doc);
     }, (e) => {
      console.error('Unable to save garage');
      res.status(400).send();
     })
  
  
});






app.listen(3000, () => {
console.log('Listening on port 3000');
});

module.exports = {app};