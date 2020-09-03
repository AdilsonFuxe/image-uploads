const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
require('dotenv').config();

const storageType = {
    local: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'storage','uploads'));
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err,hash)=>{
                if(err)
                    cb(err);

                file.key = `${hash.toString('hex')}-${file.originalname}`;
                cb(null, file.key);
            });
        }
    }),
    
    s3: multerS3({
        s3: new aws.S3(),
        bucket: 'upload-example-amf',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            crypto.randomBytes(16, (err,hash)=>{
                if(err)
                    cb(err);

                file.key = `${hash.toString('hex')}-${file.originalname}`;
                cb(null, file.key);
            });
        } 
    })
}

module.exports = {
    dest: path.resolve(__dirname, '..', '..', 'storage','uploads'),
    storage: storageType[process.env.TYPE_OF_STORAGE],
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            "image/jpeg",
            "image/pjpeg",
            "image/png",
            "image/gif"
        ];

        if(allowedMimes.includes(file.mimetype))
            cb(null, true);
        else
            cb(new Error('Invalid file type.'));
    }
}