const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const uri = 'mongodb://localhost/auth'
mongoose.connect(uri)
const db = mongoose.connection


db.on('error', (err) => {
  console.log(err)
})
db.on('open', () => {
  console.log('connected to database')
})
