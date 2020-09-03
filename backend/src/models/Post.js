const mongoose = require('../database/connection');
const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');


const s3 = new aws.S3();

const PostSchema = new mongoose.Schema({
    name: String,
    size: Number,
    key: String,
    url: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

PostSchema.pre('save', function(){
    if(this.url === '')
        this.url = `${process.env.APP_URL}/files/${this.key}`;
})

PostSchema.pre('remove', function(){
    if(process.env.TYPE_OF_STORAGE === 's3'){
        //console.log(this.key);
        return s3.deleteObject({
            Bucket: 'upload-example-amf',
            Key: this.key,
        }, function(err, data){
            if (err) console.log(err, err.stack);
            else  console.log(data);
        }).promise();
    }
    else{
        return promisify(fs.unlink)(
            path.resolve(__dirname,'..','..', 'storage', 'uploads', this.key)
        );
    }
})

module.exports =  mongoose.model('Post', PostSchema);