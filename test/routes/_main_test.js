
const server = require('../../server.js')
const UserController = require('../../controllers/user.js')()

const chai = require('chai')
const chaiHTTP = require('chai-http')
chai.use(chaiHTTP)
const should = chai.should()
const request = chai.request(server)

describe('Routes: _main', () => {
  beforeEach((done) => {
    // Remove all users
    UserController.deleteUsers().then(() => {
      return UserController.deleteDevices()
    }).then(() => done())
  })
  describe('GET /', () => {
    it('should return the status 200', (done) => {
      request.get('/')
      .end((err, res) => {
        res.should.have.status(200)
        const expected = { ok: true }
        res.body.should.be.eql(expected)
        done(err)
      })
    })
  })

  describe('GET /register', () => {
    it('should return the status 200', (done) => {
      request.get('/register')
      .end((err, res) => {
        res.should.have.status(200)
        done(err)
      })
    })
  })

  describe('POST /register', () => {
    it('should return a status 200', (done) => {
      request.post('/register')
      .send({
        email: 'alextan220990@gmail.com',
        password: '123456'
      }).end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('access_token')
        res.body.should.have.property('refresh_token')
        done()
      })
    })

    it('should throw error when password is incorrect', (done) => {
      request.post('/register')
      .send({
        email: 'alextan220990@gmail.com',
        password: null
      }).end((err, res) => {
        res.should.have.status(401)
        res.body.should.have.property('error')
        res.body.should.have.property('description')
        done()
      })
    })
    it('should throw error when email is incorrect', (done) => {
      request.post('/register')
      .send({
        email: 'wrong email',
        password: '123456'
      }).end((err, res) => {
        res.should.have.status(401)
        res.body.should.have.property('error')
        res.body.should.have.property('description')
        done()
      })
    })

    it('should return a new device when user is created', (done) => {
      request.post('/register')
      .send({
        email: 'alextan220990@gmail.com',
        password: '123456'
      }).end((err, res) => {
        request.get('/api/v1/devices')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('devices')
          res.body.devices.should.be.an('array')
          console.log(res.body)
          done()
        })
      })
    })
  })
})
