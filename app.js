const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./mongooseConfig');
const {ObjectID} = require('mongodb');

const app = express();

const {Garage} = require('./modelGarage');
const {Car} = require('./modelCar');
const {Bike} = require('./modelBike');

app.use(bodyParser.json());

app.listen(3000, () => {
console.log('Listening on port 3000');
});

module.exports = {app};