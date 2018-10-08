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
      console.error('Unable to save new garage');
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
      console.log('Unable to find by ID garage.');
      res.status(404).send();
    });
});


// this route adds a car to the garage, and removes any previously added car

app.patch('/car/:garageId', (req, res) => {
  let id = req.params.garageId;
  let color = req.body.color;
  let owner = new ObjectID(id);
  let car = new Car({color: color, owner: owner});
  
  Garage.findByIdAndUpdate(id, {$set: {car: car}}, {new: true})
    .then((doc) => {
      if (!doc) {
        console.log('Unable to find by ID and update garage.');
        return res.status(400).send();
      }
      
      if(doc.car !== null) {
        Car.findOneAndDelete({owner: owner}, (doc) => {
          console.log("removing ", doc);
        });
      }
  
      car.save()
        .then((doc) => {
          res.send(doc);
        })
        .catch((e) => {
          console.log('Unable to add car to garage.');
        });
    })
});

// Adds a bike to the db, increments bikeCount in the owner's garage
app.patch('/bike/:garageId', (req, res) => {
  let id = req.params.garageId;
  let owner = new ObjectID(id);
  let color = req.body.color;
  let bike = new Bike({color: color, owner: owner});

  Garage.findByIdAndUpdate(id, {$inc: {bikeCount: 1}}, {new: true})
    .then((doc) => {
      if (!doc) {
        console.log('Unable to find by ID and update garage.');
        return res.status(404).send();
      }
      bike.save()
        .then((bike) => {
          res.send(bike);
        })
        .catch((e) => {
          console.log('Unable to add bike to garage.');
        })
    })
});

app.delete('/bike/:bikeId', (req, res) => {
  let bikeId = req.params.bikeId;
  // use remove() because it returns the doc and lets us get the ownerID
  Bike.findByIdAndRemove(bikeId)
    .then((bike) => {
      console.log(`Removing ${bike}`);
      return bike.owner;
    })
    .then((owner) => {
      Garage.findByIdAndUpdate(owner, {$inc: {bikeCount: -1}}, {new: true})
        .then((garage) => {
          if (!garage) {
            return console.log('Unable to find garage.');
          }
          res.send(garage);
        })
      
    })
    .catch((e) => {
      console.log("The bike exploded and everyone died", e);
    });
    
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

