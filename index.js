const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

const auth = {
  MONGO_INITDB_ROOT_USERNAME: 'admin',
  MONGO_INITDB_ROOT_PASSWORD: 'admin123'
}

const dbName = 'ds215338.mlab.com:15338/crud-app'
const url = `mongodb://${auth.MONGO_INITDB_ROOT_USERNAME}:${auth.MONGO_INITDB_ROOT_PASSWORD}@${dbName}`
const options = {
  useNewUrlParser: true, 
  reconnectTries: 60, 
  reconnectInterval: 1000
}
const routes = require('./routes/routes.js')
const port = process.env.PORT || 8080
const app = express()
const http = require('http').Server(app)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(require('./auth'));
app.use('/api', routes)
app.use((req, res) => {
  res.status(404).send({ message: 'Route'+req.url+' Not found.' });
})

MongoClient.connect(url, options, (err, database) => {
  if (err) {
    console.log(`FATAL MONGODB CONNECTION ERROR: ${err}:${err.stack}`)
    process.exit(1)
  }
  app.locals.db = database.db('crud-app')
  http.listen(port, () => {
    console.log("Listening on port " + port)
    app.emit('APP_STARTED')
  })
})

module.exports = app