const request = require ('supertest');
const expect = require ('expect');
const {ObjectID} = require ('mongodb');

const {app} = require ('../app');
const {Garage} = require ('../modelGarage');
const {Car} = require ('../modelCar');
const {Bike} = require ('../modelBike');
const {Tool} = require ('../modelTool');

const toolsArray = [
  {
    _id: new ObjectID(),
    toolName: 'Wrench'
  },
  {
    _id: new ObjectID(),
    toolName: 'Hammer'
  }
];


const twinberryPeaks = [
  {
    _id: new ObjectID(),
    name: 'Big Ed\'s Gas Farm',
    bikeCount: 1,
    toolChest: toolsArray
  },
  {
    _id: new ObjectID(),
    name: 'Wally\'s Service Station'
  }
];

const badAssHarley = [
  {
    _id: new ObjectID(),
    color: 'polka dots',
    owner: twinberryPeaks[0]._id
  }
];

const ricksTool = {
  // _id: ObjectID(),
  toolName: 'Portal gun'
};


beforeEach ((done) => {
  // console.log('beforeEach');
  Bike.remove ({}).then (() => {
    Car.remove ({}).then (() => {
      Garage.remove ({})
        .then (() => {
          // ordered: true is make it fail on the first error
          Garage.insertMany (twinberryPeaks, {}, {ordered: true})
            .then (() => {
              Bike.insertMany(badAssHarley, {}, {ordered: true})
                .then(() => {done ();})
            })
            .catch ((e) => {
              return console.log ("Unable to save Twinberry Peaks");
            });
        });
    });
  });
  
});


describe ('POST /garage', () => {
  let text = "Cooter\'s garage"
  it ('Post a new garage', (done) => {
    request (app)
      .post ('/garage')
      .send ({name: text})
      .expect (200)
      .expect ((response) => {
        // console.log('***********', response.body);
        // expect(response.body).toContain({name: text})
        expect (response.body.name).toBe (text);
      })
      .end ((err, res) => {
        if (err) {
          return done (err);
        }
        Garage.find ()
          .then ((garages) => {
            expect (garages.length).toBe (3);
            expect (garages[2].name).toBe (text);
            // console.log(garages);
            done ();
          })
          .catch ((e) => {
            done (e);
          });
        
      });
  })
});


describe ('GET /garage/:id', () => {
  let id = twinberryPeaks[0]._id.toHexString ();
  it ('gets a garage from the database', (done) => {
    request (app)
      .get (`/garage/${id}`)
      .expect (200)
      .expect ((res) => {
        // console.log(res.body);
        expect (res.body.garage).toExist ();
        expect (res.body.garage.name).toEqual (twinberryPeaks[0].name);
        expect (res.body.garage._id).toEqual (id);
      })
      .end (done);
  })
  
});


// Patch Car to garage by garage id
describe ('PATCH /car/:garageId', () => {
  let garageId = twinberryPeaks[0]._id.toHexString ();
  let color = 'red';
  it ('should add a car to the garage', (done) => {
    request (app)
      .patch (`/car/${garageId}`)
      .send ({color})
      .expect (200)
      .expect ((res) => {
        expect (res.body.color).toBe (color);
        expect (res.body.owner).toBe (garageId);
        
      })
      .end ((err, res) => {
        if (err) {
          return done (err);
        }
        /*
        * The two database find()s should be run syncronously
        *  or else the passes test no matter conditions you put in
        *  to the second one
        * */
        
        Garage.find ()
          .then ((garages) => {
            // console.log(garages[0].car)
            expect (garages[0].car).toExist ();
            done ();
          })
          .catch ((e) => {
            done (e);
          })
        
        Car.findOne ({owner: garageId})
          .then ((car) => {
            // console.log(car);
            expect (car.owner.toHexString ()).toBe (garageId);
            expect (car.color).toBe (color);
            // expect(car.color).toBe(4); // will cause test to fail :-)
          })
          .catch ((e) => {
            done (e);
          });
      });
  });
  
  it ('should return a 404 when given a non-existent id', (done) => {
    let noExist = new ObjectID ();
    request (app)
      .patch (`/car/${noExist}`)
      .send ({color})
      .expect (404)
      .expect ((res) => {
        expect (res.body).toEqual ({});
      })
      .end ((err, res) => {
        if (err) {
          return done (err);
        }
        done ();
      })
  })
});

// Patch Bike to garage by garage id
describe ('PATCH /bike/:garageId', () => {
  let garageId = twinberryPeaks[0]._id.toHexString ();
  let originalCount = 0;
  let previousBikeId = null;
  let currentCount = 0;
  let color = 'plaid';
  
  it ('should fetch the previous bike count', (done) => {
    Garage.find ({_id: garageId})
      .then ((garage) => {
        originalCount = garage[0].bikeCount;
        done ();
      })
      .catch ((e) => {
        done (e);
      })
  });
  
  /*
  * In order to test two collections in one it()
  * you have to chain the requests
  * do so by passing an anonymous fn into .end()
  * and making the next call to request the body of the function
  * you call done() from the deepest .end() in the chain
  * */
  it ('should add a bike to the database', (done) => {
    request (app)
      .patch (`/bike/${garageId}`)
      .send ({color})
      .expect (200)
      .expect ((res) => {
        previousBikeId = res.body._id;
        expect (res.body).toExist ();
        expect (res.body.owner).toEqual (garageId);
        expect (res.body.color).toEqual (color);
      })
      .end (() => {
        request (app)
          .get (`/garage/${garageId}`)
          .expect (200)
          .expect ((res) => {
            currentCount = res.body.garage.bikeCount;
            expect (currentCount - originalCount).toEqual (1);
          })
          
          .end ((err, res) => {
            if (err) {
              return done (err);
            }
            done ();
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
  
  it ('should have the same bikeCount as bikes owned in the bikes collection', (done) => {
    // let ownedBikesInCollection = 0;
    let garageBikeCount = 0;
    request (app)
      .patch (`/bike/${garageId}`)
      .send ({color})
      .expect (200)
      .expect ((res) => {
        expect (res.body).toExist ();
        expect (res.body.owner).toEqual (garageId);
        expect (res.body.color).toEqual (color);
      })
      .end (() => {
        request (app)
          .patch (`/bike/${garageId}`)
          .send ({color: 'blue'})
          .expect (200)
          .expect ((res) => {
            expect (res.body).toExist ();
            expect (res.body.owner).toEqual (garageId);
            expect (res.body.color).toEqual ('blue');
          }).end ((err, res) => {
          request (app)
            .get (`/bikes/${garageId}`)
            .expect (200)
            .end ((err, res) => {
              if (err) {
                return done (err);
              }
              let bikesOwned = res.body.length;
              
              // Check that the number of owned bikes in the bikes collection
              // is equal to the bikeCount of the relevant garage object
              request (app)
                .get (`/garage/${garageId}`)
                .expect ((response) => {
                  expect (bikesOwned).toEqual (response.body.garage.bikeCount);
                })
                .end ((err, response) => {
                  if (err) {
                    return done (err);
                  }
                  done ();
                }); //end end()
            })
        })
      });
  });
  
  
}); // end describe


describe ('GET /bike/:bikeId', () => {
  let id = badAssHarley[0]._id.toHexString();
  it('should get the selected bike from the bikes collection', (done) => {
    request(app)
      .get(`/bike/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toExist();
        expect(res.body.color).toEqual(badAssHarley[0].color);
        expect(res.body.owner).toEqual(twinberryPeaks[0]._id);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
      done();
      })
  });
});

describe ('DELETE /bike/:bikeId', () => {
  let id = badAssHarley[0]._id.toHexString();
  it('should remove the selected bike from the bikes collection', (done) => {
    request(app)
      .delete(`/bike/${id}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        request(app)
          .get(`/bike/${id}`)
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
  
  it('should decrement the owner\'s bike count', (done) => {
    let previousBikeCount = 0;
    let owner = null;
    request(app)
      .get(`/bike/${id}`)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        owner = res.body.owner;
        request(app)
          .get(`/garage/${owner}`)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            previousBikeCount = res.body.garage.bikeCount;
            
            request(app)
              .delete(`/bike/${id}`)
              .end((err, res) => {
                request(app)
                  .get(`/garage/${owner}`)
                  .expect((res) => {
                    let currentCount = res.body.garage.bikeCount;
                    expect(previousBikeCount - currentCount).toEqual(1);
                  })
                  .end((err, res) => {
                    if (err) {
                      return done(err);
                    }
                    done();
                  });
              });
          });
      });
  });
});


describe('GET ./tools/:garageId', () => {
  let id = twinberryPeaks[0]._id.toHexString();
 it('should get all the tools in the tool chest', (done) => {
   request(app)
     .get(`/tools/${id}`)
     .expect(200)
     .expect((res) => {
       expect(res.body).toExist();
       expect(res.body[0].toolName).toEqual(toolsArray[0].toolName);
       expect(res.body[0]._id).toEqual(toolsArray[0]._id.toHexString());
       expect(res.body[1].toolName).toEqual(toolsArray[1].toolName);
       expect(res.body[1]._id).toEqual(toolsArray[1]._id.toHexString());
     })
     .end((err, res) => {
       if (err) {
         return done(err);
       }
     done();
     });
 });
});



// Patch tool add to garage by garage id
describe('PATCH /tools/:garageId', () => {
  let garageId = twinberryPeaks[0]._id.toHexString();

  it('should add a tool to the tools list', (done) => {
  request(app)
    .get(`/tools/${garageId}`)
    .expect((res) => {
      expect(res.body.length).toEqual(2);
    }).end((err, res) => {
    if (err) {
      return done(err);
    }
    request(app)
      .patch(`/tools/${garageId}`)
      .send(ricksTool)
      .expect(200)
      .expect((res) => {
        expect(res.body.toolChest).toExist();
        expect(res.body.toolChest[2].toolName).toEqual(ricksTool.toolName);
      })
      .end((err, res) => {
        if (err) {
          return done(e);
        }
        done();
      })
    
    });
  });
});


// Patch tool remove from garage by garage id
describe('PATCH /dropTool/:garageId', () => {
  let garageId = twinberryPeaks[0]._id.toHexString();
  let deleteMe = {toolName: 'Wrench'};
  
  it('should remove a tool from the tools list', (done) => {
    request(app)
      .get(`/tools/${garageId}`)
      .expect((res) => {
        expect(res.body.length).toEqual(2);
      }).end((err, res) => {
      if (err) {
        return done(err);
      }
      request(app)
        .patch(`/dropTool/${garageId}`)
        .send(deleteMe)
        .expect(200)
        .expect((res) => {
          expect(res.body.toolChest).toExist();
          expect(res.body.toolChest.length).toEqual(1);
          expect(res.body.toolChest[0].toolName).toNotEqual(deleteMe.toolName);
        })
        .end((err, res) => {
          if (err) {
            return done(e);
          }
          done();
        })
      
    });
  });
  
  
});