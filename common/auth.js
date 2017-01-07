const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user.js')

module.exports = function (passport) {

  passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    passReqToCallback: true
  }, function (req, email, password, done) {
    process.nextTick(() => {
      User.findOne({ email })
      .then((user) => {
        if (user) {
          return done(null, user)
        } else {
          const user = new User()
          user.email = email
          user.password = user.generateHash(password)

          user.save()
          .then(() => {
            return done(null, user)
          })
          .catch((err) => {
            return done(err)
          })
        }
      })
      .catch((err) => {
        return done(err)
      })
    })
  }))

  passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    passReqToCallback: true
  }, function (req, email, password, done) {
    process.nextTick(() => {
      User.findOne({ email })
      .then((user) => {
        if (user) {
          return done(null, user)
        } else if (!user.validPassword(password)) {
          return done(null, false, 'Wrong password')
        } else {
          return done(null, false, 'No user found')
        }
      })
      .catch((err) => {
        return done(err)
      })
    })
  }))
  return passport
}
