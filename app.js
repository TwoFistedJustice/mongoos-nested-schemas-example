const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./mongooseConfig');
const {ObjectID} = require('mongodb');

const app = express();

const {Garage} = require('./modelGarage');
const {Car} = require('./modelCar');
const {Bike} = require('./modelBike');

app.use(bodyParser.json());


// Routes that save and fetch simple Garage ojbects to the db
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


app.get('/garage/:id', (req, res) => {
  let id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(400).send();
  }
  
  Garage.findById(id)
    .then((doc) => {
      if (!doc) {
        return res.status(400).send();
      }
      res.send({doc});
    })
    .catch((e) => {
      console.error('---------------------> Unable to find garage');
      res.status(404).send();
    });
});


app.patch('/garage/:id', (req, res) => {
  let id = req.params.id;
  let color = req.body.color;
  let owner = new ObjectID(id);
  
  let car = new Car({color: color, owner: owner});
  
  
  
  Garage.findByIdAndUpdate(id, {$set: {car: car}, $inc: {carCount: 1}}, {new: true})
    .then((doc) => {
      if (!doc) {
        console.log('---------------------> find by id and update failed');
        res.status(400).send();
      }
      
      if(doc.carCount !== 0) {
        Car.findOneAndDelete({owner: owner}, (doc) => {
          console.log("removing ", doc);
        });
      }
  
      car.save()
        .then((doc) => {
          res.send(doc);
        })
        .catch((e) => {
          console.log('Unable to add car to garage');
        });
      
    })
  
  
  
  
});












app.listen(3000, () => {
console.log('Listening on port 3000');
});


// this shows that it Schema.Types.ObjectId is the same as mongoose.Object
var showObjIdEqual = function() {
  let test = mongoose.ObjectId === mongoose.Schema.Types.ObjectId;
  console.log(`It is ${test} that the declarations are interchangeable.`);
};

showObjIdEqual();

module.exports = {app};

