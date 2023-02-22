/**
 * Upload controller module
 * @category  Controller / Route
*/
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const config = require('../config.js');
const router = express.Router();

//default allowed extensions
const allowedExtensions = ['png','jpg','gif','jpeg','pdf','txt','csv','doc','docx','ppt','xls','xsp','xml','json'];

const publicDir = config.app.publicDir;
const tempDir = config.upload.tempDir;

let uploadSettings = {}

const storage = multer.diskStorage({
	destination: function(req, file, callback) {
		var dir =  path.join(publicDir, tempDir);
		// if (!fs.existsSync(dir)){
		// 	fs.mkdirSync(dir);
		// }
		callback(null, dir);
	},
	filename: function(req, file, callback) {
		//save filname type.
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
		else if(filenameType == 'filecount'){
			//save file by incrementing the dirctory file count e.g 40.jpg prefix can be added to file on upload
			var uploadDir = uploadSettings.uploadDir || '';
			var dir = path.join(publicDir, uploadDir);
			var files = fs.readdirSync(dir);
			newFilename = files.length;
		}
		else{
			//save file with random string
			const crypto = require("crypto");
			newFilename = crypto.randomBytes(16).toString("hex");
		}
		//adding prefix to file name example profile_pic_20.jpg
		var filenamePrefix = uploadSettings.filenamePrefix || ''
		
		let fileExt = path.extname(file.originalname).substr(1).toLowerCase();
		newFilename = filenamePrefix + newFilename + '.' + fileExt;
		callback(null, newFilename);
	}
});

const upload = multer({
	storage: storage,
	fileFilter: function (req, file, callback) {
		var ext = path.parse(file.originalname).ext.replace('.','').toLowerCase();
		var allowed = allowedExtensions;
		if(uploadSettings.extensions){
			allowed = uploadSettings.extensions.replace(/\s/g, '').split(','); //replace any white space and convert to array
		}
		if(allowed.indexOf(ext) === -1) {
			return callback('file extension not allowed', false);
		}
		callback(null, true)
	},
	limits: {
		fileSize: uploadSettings.maxFileSize * 1024 * 1024,
		files: uploadSettings.maxFiles
	}
});

router.post('/upload/:fieldname', function(req, res, next){
	let uploadField = req.params.fieldname;
	uploadSettings = config.upload[uploadField];
	if(!uploadSettings){
		return res.badRequest(`No upload settings found for ${uploadField}`);
	}
	return next();
},
upload.array("file"), function (req, res, next) {
	if(req.files){
		let uploadedPaths = req.files.map(function(v) {
			let filePath  = v.path.replace(/\\/g, "/");
			filePath = filePath.replace("assets/","");
			return filePath;
		});
		const allPaths = uploadedPaths.toString();
		return res.ok(allPaths);
	}
	else{
		return res.badRequest('No file uploaded.')
	}
});

/**
 * remove temporary uploaded file when deleted by client
 * @category  Controller / Route
*/
router.post('/remove_temp_file', function(req, res){
	let file = req.body.temp_file;
	if(file){
		let filename = path.basename(file);
		let tmpDir = config.upload.tempDir;
		let fullname = path.join(publicDir, tmpDir, filename);
		if (fs.existsSync(fullname)) {
			fs.unlinkSync(fullname);
		}
		return res.ok("File Deleted");
	}
	return res.badRequest("Invalid temp file")
});
module.exports = router;