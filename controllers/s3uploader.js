/**
 * Upload controller module
 * @category  Controller / Route
*/
const express = require('express');
const multer = require('multer');
const path = require('path');
const multerS3 = require('multer-s3');

const aws = require('aws-sdk');
const config = require('../config.js');
const router = express.Router();


//default allowed extensions
const allowedExtensions = ['png','jpg','gif','jpeg','pdf','txt','csv','doc','docx','ppt','xls','xsp','xml','json'];


let uploadSettings = {}

// CONFIGURATION OF S3
aws.config.update({
    secretAccessKey: config.s3.secretAccessKey,
    accessKeyId: config.s3.accessKeyId,
    region: config.s3.region
});

// CREATE OBJECT FOR S3
const s3 = new aws.S3();

const upload = multer({
	limits: {
		fileSize: uploadSettings.maxFileSize * 1024 * 1024,
		files: uploadSettings.maxFiles
	},
	storage: multerS3({
		s3: s3,
		bucket: config.s3.bucket,
		metadata: function (req, file, cb) {
		  cb(null, {fieldName: file.fieldname});
		},
		key: function (req, file, cb) {
			let validated = validateFileExt(file);
			if(!validated){
				return cb('file extension not allowed', false);
			}
			let fileName = getFileName(file);
		  	cb(null, fileName);
		}
	})
});

function getFileName(file){
	var newFilename = "";
	var filenameType = uploadSettings.filenameType || 'random';
	if(filenameType == 'date'){
		//save file in date format e.g 2018-09-24-02-30-40.jpg
		newFilename = new Date().toISOString().replace(/T/, '-').replace(/\..+/, '').replace(/\:/g, '-')
	}
	else if(filenameType == 'timestamp'){
		//save file in unix timestamp e.g 20180924023040.jpg
		newFilename = Math.floor(new Date() / 1000);
	}
	else if(filenameType == 'original'){
		//save file with original filename form the user computer e.g mycv.docx
		newFilename = path.parse(file.originalname).name
	}
	else{
		//save file with random string
		const crypto = require("crypto");
		newFilename = crypto.randomBytes(16).toString("hex");
	}
	//adding prefix to file name example profile_pic_20.jpg
	var filenamePrefix = uploadSettings.filenamePrefix || ''
	let fileExt = path.extname(file.originalname).substr(1).toLowerCase();
	newFilename = uploadSettings.uploadDir +  '/' +  filenamePrefix + newFilename + '.' + fileExt;
	return newFilename;
}

function validateFileExt(file){
	let valid = true;
	var ext = path.parse(file.originalname).ext.replace('.','').toLowerCase();
	var allowed = allowedExtensions;
	if(uploadSettings.extensions){
		allowed = uploadSettings.extensions.replace(/\s/g, '').split(','); //replace any white space and convert to array
	}
	if(allowed.indexOf(ext) === -1) {
		valid = false;
	}
	return valid;
}
router.post('/upload/:fieldname', function(req, res, next){
	let uploadField = req.params.fieldname;
	uploadSettings = config.upload[uploadField];
	if(!uploadSettings){
		return res.badRequest(`No upload settings for ${uploadField}`);
	}
	return next();
},
upload.array("file"), function (req, res, next) {
	if(req.files){
		let uploadedPaths = req.files.map(function(v) {
			return v.location;
		});
		const allPaths = uploadedPaths.toString()
		return res.ok(allPaths);
	}
	else{
		return res.badRequest('No file uploaded.');
	}
});

/**
 * remove temporary uploaded file when deleted by client
 * @category  Controller / Route
*/
router.post('/remove_temp_file', function(req, res){
	let file = req.body.temp_file;
	if(file){
		// let filename = path.basename(file);
		// let tmpDir = config.upload.tempDir;
		// let fullname = path.join(publicDir, tmpDir, filename);
		// if (fs.existsSync(fullname)) {
		// 	fs.unlinkSync(fullname);
		// }

		var params = {  Bucket: config.s3.bucket, Key: 'your object' };

		s3.deleteObject(params, function(err, data) {
			if (err) console.log(err, err.stack);  // error
			else     console.log();                 // deleted
		});
		return res.ok("File Deleted");
	}
	return res.badRequest("Invalid temp file")
});
module.exports = router;