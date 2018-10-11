require('./config');
const express = require('express');
const bodyParser = require('body-parser');

// const {mongoose} = require('./mongooseConfig');
const {mongoose} = require('./config');
const {ObjectID} = require('mongodb');


const app = express();
const port = process.env.PORT || 3000;

const {Garage} = require('./modelGarage');
const {Car} = require('./modelCar');
const {Bike} = require('./modelBike');

// const {toolSchema} = require('./modelTool');
const {Tool} = require('./modelTool');

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
    .then((garage) => {
      if (!garage) {
        return res.status(400).send();
      }
      res.send({garage});
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
    .then((garage) => {
      if (!garage) {
        console.log('Unable to find by ID and update garage.');
        return res.status(404).send();
      }
      
      if(garage.car !== null) {
        Car.findOneAndDelete({owner: owner}, (doc) => {
          console.log("removing ", doc);
        });
      }
  
      car.save()
        .then((car) => {
          res.send(car);
        })
        .catch((e) => {
          console.log('Unable to add car to garage.');
          return res.status(400).send();
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
    .then((garage) => {
      if (!garage) {
        console.log('Unable to find by ID and update garage.');
        return res.status(404).send();
      }
      bike.save()
        .then((bike) => {
          res.send(bike);
        })
        .catch((e) => {
          console.log('Unable to add bike to garage.');
          return res.status(400).send();
        })
    })
});

// Finds a bike by ID, removes it, and decrements the owner's bikeCount
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
      console.log("The bike exploded and the garage burned down. Sorry.", e);
      return res.status(400).send();
    });
  });

/*
*  Tool Schema Array Routes
* */

app.patch('/tools/:garageId', (req, res) => {
  let garageId = req.params.garageId;
  let tool = new Tool({toolName: req.body.toolName});
  
  // evidently the $push isn't necessary since it seems to work without it
  // Garage.findByIdAndUpdate(garageId, {$push: {tools: tool}}, {new: true})
  Garage.findByIdAndUpdate(garageId, {new: true})
    .then((garage) => {
      if (!garage) {
        console.log('Unable to find by ID and update garage.');
        return res.status(404).send();
      }
      garage.toolChest.push(tool);
      garage.save()
        .then((garage) => {
         res.send(garage);
        })
        .catch((e) => {
          console.log(garage);
          console.log("Your tool fell off and rolled away.", e);
          return res.status(400).send();
        })
    });
});

app.patch('/dropTool/:garageId', (req, res) => {
  let garageId = req.params.garageId;

  // this will remove ALL elements that meet the criteria
  // so be careful about passing in non-unique values
  // consider using the unique object id whenever possible
  Garage.findByIdAndUpdate(garageId, {$pull:{toolChest: {toolName: req.body.toolName}}}, {new: true})
    .then((garage) => {
      
      if (!garage) {
        console.log('Unable to find by ID and update garage.');
        return res.status(400).send();
      }
      // TODO -- not really "todos". Just using it for the syntax highlighting in Webstorm
      // TODO you can call .pull() passing in a specific objectId
      // garage.toolChest.pull('5bbbfeb6c5ce8f27f809f89b');
      
      // TODO you cannot pass in any other conditions, it won't work
      // garage.toolChest.pull({toolName: "awl"});
      
      // TODO This appears to work the same as .pull()
      // garage.toolChest.id('5bbc25acb3c39d28d47a3a3f').remove();
      
      garage.save()
        . then((garage) => {
            res.send(garage);
        })
    
    })
    .catch((e) => {
      console.log(garage);
      console.log("Your tool fell off and rolled away.", e);
      return res.status(400).send();
    });
  
});



app.listen(port, () => {
console.log(`Listening on port ${port}`);
});


// this shows that it Schema.Types.ObjectId is the same as mongoose.Object
var showObjIdEqual = function() {
  let test = mongoose.ObjectId === mongoose.Schema.Types.ObjectId;
  console.log(`It is ${test} that the declarations are interchangeable.`);
};

showObjIdEqual();

module.exports = {app};

