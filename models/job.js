const mongoose = require('mongoose')
const path = require('path')
const svgsPath = 'uploads/svgs'

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  createDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  publishDate: {
    type: Date,
    required: true
  },
  svgName: {
    type: String,
    required: true
  },
  fileCount: {
    type: Number,
    required: true
  },
  infos: {
    type: String
  }
})

jobSchema.virtual('svgsPath').get(function() {
  if (this.svgName != null) {
    return path.join('/', svgsPath, this.svgName)
  }
})

module.exports = mongoose.model('Job', jobSchema)
module.exports.svgsPath = svgsPath