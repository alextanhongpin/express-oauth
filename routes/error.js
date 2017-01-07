// error.js
//
// Description: Error middleware to capture all errors
// https://derickbailey.com/2014/09/06/proper-error-handling-in-expressjs-route-handlers/
//
function clientErrorHandler (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({
      error: 'Something failed'
    })
  } else {
    next(err)
  }
}

function errorHandler (err, req, res, next) {
  // Handle redirection using res.location
  res.status(err.code || 500)
  res.format({
    'application/json' () {
      res.send({
        name: err.name || 'Internal Server Error',
        message: err.message || 'Something unexpected has happened'
      })
    },
    'text/html' () {

    }
  })
}

module.exports = { clientErrorHandler, errorHandler }
