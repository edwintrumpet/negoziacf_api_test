const express = require('express')
const {port} = require('./config')

const app = express()

app.get('/', (req, res) => {
  res.send('Express works!')
})

app.listen(port, err => {
  if(err) console.log(err)
  else console.log(`Listening on http://localhost:${port}`)
})
