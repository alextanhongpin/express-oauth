/*
 * Description: Create a Jwt Token with expiry date
 *
 * Secret is created with the following command:
 * echo -n "j0tk3y" | openssl dgst -sha256 -hmac "j0ts3cr3t"
 *
**/

const JWT_SECRET = process.env.JWT_SECRET
const jwt = require('jsonwebtoken')

function sign (payload, expiresIn = '5m') {
  const options = {
    expiresIn: expiresIn
  }
  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET, options, (err, encoded) => {
      if (err) {
        reject(err)
      }
      resolve(encoded)
    })
  })
}

function signSync (payload, expiresIn = '5m') {
  const options = {
    expiresIn: expiresIn
  }
  return jwt.sign(payload, JWT_SECRET, options)
}

function verify (token, cb) {
  if (cb instanceof Function) {
    jwt.verify(token, JWT_SECRET, cb)
  } else {
    return new Promise((resolve, reject) => {
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          return reject(err)
        }
        resolve(decoded)
      })
    })
  }
}

module.exports = { sign, signSync, verify }

