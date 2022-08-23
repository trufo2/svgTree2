const express = require('express')
const router = express.Router()
const Job = require('../models/job')

router.get('/', async (req, res) => {
  let jobs
  try {
    books = await Book.find().sort({createdAt: 'desc'}).limit(10).exec()
  } catch {
    books = []
  }
  res.render('index', {jobs:jobs})
})

module.exports = router