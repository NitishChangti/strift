import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req, files, cb) {
        return cb(null, './public/tempFile')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})


export const upload = multer({ storage })