const multer = require("multer")
const fs = require('fs')

const { createPath } = require("./path-helper")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = createPath([req.params.folderName])
    fs.mkdirSync(uploadDir, { recursive: true })
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })

module.exports = { upload }