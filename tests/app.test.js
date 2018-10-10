const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {app} = require('../app');
const {Garage} = require('../modelGarage');
const {Car} = require('../modelCar');
const {Bike} = require('../modelBike');
const {Tool} = require('../modelTool');

beforeEach((done) => {
  Garage.remove({}).then(() => {done()});
});



describe('POST /garage', () => {
  let text = "Joes garage"
  it('Post a new garage', (done) => {
    request(app)
      .post('/garage')
      .send({name: text})
      .expect(200)
      .expect((response) => {
        console.log('***********', response.body);
        // expect(response.body).toContain({name: text})
        expect(response.body).toInclude({name: text})
      })
      .end((err, res) => {
        if (err) {
          return done (err);
        }
          Garage.find({name: text})
            .then((garage) => {
              console.log('%%%%%%%%%%%%%%%%',garage);
              done();
            })
            .catch((e) => {
            console.log(e);
            })
        
      });
  })
});