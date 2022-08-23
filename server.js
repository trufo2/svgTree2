if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')

const indexRouter = require('./routes/index')
const userRouter = require('./routes/users')
const jobRouter = require('./routes/jobs')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit:'10mb', extended:false}))

const mongoose = require ('mongoose')
mongoose.connect(process.env.DB_URL)
const db = mongoose.connection
db.on ('error', error => console.error())
db.once ('open', () => console.log('mongoose connected'))

app.use('/', indexRouter)
app.use('/users', userRouter)
app.use('/jobs', jobRouter)

app.listen(process.env.PORT || 8088)