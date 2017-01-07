// Initialize all routes here
const userAPIRoute = require('./user-api.js')
const protectedAPIRoute = require('./protected-api.js')

const clientRoute = require('../routes/client.js')
const userRoute = require('../routes/user.js')
const oauthRoute = require('../routes/oauth.js')
const deviceRoute = require('../routes/device.js')
const errorRoute = require('../routes/error.js')

const oauth = require('../modules/oauth.js')

module.exports = function init (app, passport) {
  app.get('/', (req, res) => {
    res.status(200).json({
      ok: true
    })
  })
  app.get('/home', (req, res) => {
    res.render('home')
  })

  app.use('/api/v1', userAPIRoute)
  app.use('/api/v1', oauth.verify, protectedAPIRoute)
  app.use('/', userRoute({passport}))
  app.use('/', oauthRoute)
  app.use('/', clientRoute)
  app.use('/', deviceRoute)

  /*
   * Error handling
  **/
  app.use(errorRoute.clientErrorHandler)
  app.use(errorRoute.errorHandler)
}
