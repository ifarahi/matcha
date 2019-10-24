const uuid = require('uuid');
const multer = require('multer');
const fs = require('fs');
const canvas = require('canvas');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file)
        cb(null, './images')
    },
    filename: function (req, file, cb) {
      cb(null, `${uuid()}-${Date.now()}.${file.mimetype.split('/')[1]}`);
    }
});

const upload = multer({ storage: storage , limits: { fileSize: 1024 * 1024 * 5 }});

module.exports = {
    upload: upload,
    validate: (req, res, next) => {
        const errorObject = {
            status: false,
            message: ''
        }
        console.log(req.file.path);
        canvas.loadImage(req.file.path)
            .then((result) =>  next() )
            .catch((error) => {
                fs.unlink(req.file.path, (error) => {
                    if (error)
                        throw error;
                    else {
                        errorObject.message = 'Invalid Image';
                        res.json(errorObject);
                    }
                });
            });
    }
}