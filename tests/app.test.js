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
  Car.remove({}).then(() => {
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
        expect(response.body.name).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
          Garage.find()
            .then((garages) => {
              expect(garages.length).toBe(3);
              expect(garages[2].name).toBe(text);
              // console.log(garages);
              done();
            })
            .catch((e) => {
              done(e);
            });
        
      });
  })
});


describe('GET /garage/:id', () => {
  let id = twinberryPeaks[0]._id.toHexString();
  it('gets a garage from the database', (done) => {
    request(app)
      .get(`/garage/${id}`)
      .expect(200)
      .expect((res) => {
        // console.log(res.body);
        expect(res.body.garage).toExist();
        expect(res.body.garage.name).toEqual(twinberryPeaks[0].name);
        expect(res.body.garage._id).toEqual(id);
      })
      .end(done);
  })
  
});



// Patch Car to garage by garage id
describe('PATCH /car/:garageId', () => {
  let garageId = twinberryPeaks[0]._id.toHexString();
  let color = 'red';
  it('should add a car to the garage', (done) => {
    request(app)
      .patch(`/car/${garageId}`)
      .send({color})
      .expect(200)
      .expect((res) => {
        expect(res.body.color).toBe(color);
        expect(res.body.owner).toBe(garageId);
        
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        /*
        * The two database find()s should be run syncronously
        *  or else the passes test no matter conditions you put in
        *  to the second one
        * */
        
        Garage.find()
          .then((garages) => {
            console.log(garages[0].car)
            expect(garages[0].car).toExist();
            done();
          })
          .catch((e) => {
           done(e);
          })
  
          Car.findOne({owner: garageId})
            .then((car) => {
              // console.log(car);
              expect(car.owner.toHexString()).toBe(garageId);
              expect(car.color).toBe(color);
              // expect(car.color).toBe(4); // will cause test to fail :-)
            })
            .catch((e) => {
              done(e);
            });
      });
  });
  
  it('should return a 404 when given a non-existent id', (done) => {
    let noExist = new ObjectID();
    request(app)
      .patch(`/car/${noExist}`)
      .send({color})
      .expect(404)
      .expect((res) => {
        expect(res.body).toEqual({}, 'farty');
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        done();
      })
    
  })
  
  
});

/*

// Patch Bike to garage by garage id
describe('PATCH /bike/:garageId', () => {


// bike count went up
// get bikeCount before
// get bikecount after

// bike exists
// bike owner is garage id
// bike color is correc


});

*/


/*


// DELETE bike by bike id
describe('DELETE /bike/:bikeId', () => {

});

// Patch tool add to garage by garage id
describe('PATCH /tools/:garageId', () => {

});


// Patch tool remove from garage by garage id
describe('PATCH /dropTool/:garageId', () => {

});*/
