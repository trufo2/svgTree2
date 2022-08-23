const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const User = require('../models/user')
const Job = require('../models/job')
const uploadPath = path.join('public', Job.svgsPath)
const imageMimeTypes = ['image/svg+xml', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif']
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

router.get('/', async (req, res) => {
  let query = Job.find()
  if(req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if(req.publishedBefore != null && req.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  if(req.publishedAfter != null && req.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter)
  }
  try {
    const jobs = await query.exec()
    res.render('jobs/index', {
      jobs: jobs,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

router.get('/new', async (req, res) => {
  renderNewPage(res, new Job())
})

router.post('/', upload.single('svgFiles'), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null
  const job = new Job({
    title: req.body.title,
    user: req.body.user,
    publishDate: new Date(req.body.publishDate),
    fileCount: req.body.fileCount,
    svgName: fileName,
    infos: req.body.infos
  })
  try {
    const newJob = await job.save()
    //res.redirect(`jobs/${newJob.id}`)
    res.redirect('jobs')
  } catch {
    if (job.svgName != null) {
      removeSvg(job.svgName)
    }
    renderNewPage(res, job, true)
  }
})

function removeSvg(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err => {
    if (err) console.error(err)
  })
}

async function renderNewPage(res, job, hasError=false) {
  try {
    const users = await User.find({})
    const params = {
      users: users,
      job: job
    }
    if (hasError) params.errorMessage = 'erreur en créant le job'
    res.render('jobs/new', params)
  } catch {
    res.redirect('/jobs')
  }
}
module.exports = router