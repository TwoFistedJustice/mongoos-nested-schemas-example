const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {app} = require('../app');
const {Garage} = require('../modelGarage');
const {Car} = require('../modelCar');
const {Bike} = require('../modelBike');
const {Tool} = require('../modelTool');

const twinberryPeaks = [
  {_id: new ObjectID(),
   name: 'Big Ed\'s Gas Farm'
  },
  {
    _id: new ObjectID(),
    name: 'Wally\'s Service Station'
  }
];


beforeEach((done) => {
  // Garage.remove({}).then(() => {done()});
  Garage.remove({})
    .then(() => {
      // ordered: true is make it fail on the first error
      Garage.insertMany(twinberryPeaks, {}, {ordered: true})
        .then(() => {done();})
        .catch((e) => {
          return console.log("Unable to save Twinberry Peaks");
        });
    });
});


describe('POST /garage', () => {
  let text = "Cooter\'s garage"
  it('Post a new garage', (done) => {
    request(app)
      .post('/garage')
      .send({name: text})
      .expect(200)
      .expect((response) => {
        // console.log('***********', response.body);
        // expect(response.body).toContain({name: text})
        expect(response.body).toInclude({name: text})
      })
      .end((err, res) => {
        if (err) {
          return done (err);
        }
          Garage.find()
            .then((garages) => {
              expect(garages.length).toBe(3);
              expect(garages[2].name).toBe(text);
              console.log(garages);
              done();
            })
            .catch((e) => {
              done(e);
            });
        
      });
  })
});



// Patch Car to garage by garage id
// Patch Bike to garage by garage id
// DELETE bike by bike id
// Patch tool add to garage by garage id
// Patch tool remove from garage by garage id
