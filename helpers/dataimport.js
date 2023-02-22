/**
* Upload contoller module
* @category  Controller / Route
*/
var express = require('express');
var multer = require('multer');
var path = require('path');
var router = express.Router();
const allowedExtensions = ['csv','json'];
const maxFileSize =  50 //in mb 50mb
const numFiles =  10 //max number of file per upload
const fs = require('fs');
const uploadDir =  './assets/uploads/files/';
var Storage = multer.diskStorage({
	destination: function(req, file, callback) {
		if (!fs.existsSync(uploadDir)){
			fs.mkdirSync(uploadDir);
		}
		callback(null, uploadDir);
	},
	filename: function(req, file, callback) {
		//save file with original filename form the user computer e.g mycv.docx
		var fdate = new Date().toISOString().replace(/T/, '-').replace(/\..+/, '').replace(/\:/g, '-');
		var newfilename = fdate + '_' + file.originalname
		callback(null, newfilename);
	}
});
var upload = multer({
	storage: Storage,
	fileFilter: function (req, file, callback) {
		var ext = path.parse(file.originalname).ext.replace('.','').toLowerCase();
		if(allowedExtensions.indexOf(ext) === -1) {
			return callback(new Error('file extension not allowed'));
		}
		callback(null, true)
	},
	limits:{
		fileSize: maxFileSize * 1024 * 1024
	}
});
module.exports = {upload};