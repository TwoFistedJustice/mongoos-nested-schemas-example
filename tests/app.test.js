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
  // console.log('beforeEach');
  Bike.remove({}).then(() => {
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
            // console.log(garages[0].car)
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
        expect(res.body).toEqual({});
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        done();
      })
  })
});

// Patch Bike to garage by garage id
describe('PATCH /bike/:garageId', () => {
  let garageId = twinberryPeaks[0]._id.toHexString();
  let originalCount = 0;
  let previousBikeId = null;
  let currentCount = 0;
  let color = 'plaid';
  
  it('should fetch the previous bike count', (done) => {
    Garage.find({_id: garageId})
      .then((garage) => {
          originalCount = garage[0].bikeCount;
          done();
      })
      .catch((e) => {
        done(e);
      })
  });
  
  /*
  * In order to test two collections in one it()
  * you have to chain the requests
  * do so by passing an anonymous fn into end
  * and making the next request the body of the function
  * you call done() from the deepest .end() in the chain
  * */
  it('should add a bike to the database', (done) => {
    request(app)
      .patch(`/bike/${garageId}`)
      .send({color})
      .expect(200)
      .expect((res) => {
        previousBikeId = res.body._id;
        expect(res.body).toExist();
        expect(res.body.owner).toEqual(garageId);
        expect(res.body.color).toEqual(color);
      })
      .end(() => {
        request(app)
          .get(`/garage/${garageId}`)
          .expect(200)
          .expect((res) => {
            currentCount = res.body.garage.bikeCount;
            expect(currentCount - originalCount).toEqual(1);
          })
    
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            done();
          });
      });
  });
  
  
  /*
  *  The key to getting multiple request(app) calls to talk to each other
  *  is to use the second argument in end(err, res){}
  *  That second argument is the return value of the previous
  *  .expect() call
  *
  *  This test adds two bikes in succession and in the final end() call
  *  checks that garage.bikeCount is equal to the number of owned bikes in the
  *  bikes collection
  * */
  
  it('should have the same bikeCount as bikes owned in the bikes collection', (done) => {
    // let ownedBikesInCollection = 0;
    let garageBikeCount = 0;
    request(app)
      .patch(`/bike/${garageId}`)
      .send({color})
      .expect(200)
      .expect((res) => {
        expect(res.body).toExist();
        expect(res.body.owner).toEqual(garageId);
        expect(res.body.color).toEqual(color);
      })
      .end(() => {
        request(app)
          .patch(`/bike/${garageId}`)
          .send({color: 'blue'})
          .expect(200)
          .expect((res) => {
            expect(res.body).toExist();
            expect(res.body.owner).toEqual(garageId);
            expect(res.body.color).toEqual('blue');
          }).end((err, res) => {
            request(app)
              .get(`/bikes/${garageId}`)
              .expect(200)
              .end((err, res) => {
                if (err) {
                  return done(err);
                }
                let bikesOwned = res.body.length;
                
                // Check that the number of owned bikes in the bikes collection
                // is equal to the bikeCount of the relevant garage object
                request(app)
                  .get(`/garage/${garageId}`)
                  .expect((response) => {
                    expect(bikesOwned).toEqual(response.body.garage.bikeCount);
                  })
                  .end((err, response) => {
                    if (err) {
                      return done(err);
                    }
                    done();
                  }); //end end()
              })
          })
      });
  });
  
  

}); // end describe




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
