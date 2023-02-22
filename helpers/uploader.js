
const sharp = require('sharp');
const path = require('path');
const config = require('../config.js');
const fs = require('fs');

const publicDir = config.app.publicDir;
const tempDir = config.upload.tempDir;

class Uploader {
	files = [];
	fieldname = "";
	uploadSettings = {}
	constructor(files, fieldname) {
		this.files = files;
		this.fieldname = fieldname;
		this.uploadSettings = config.upload[fieldname];
	}
	moveUploadedFiles() {
		let arrFiles = [];
		if(Array.isArray(this.files)){
			arrFiles = this.files;
		}
		else{
			arrFiles = this.files.toString().split(",");
		}
		if (arrFiles.length) {
			let uploadedFiles = [];
			arrFiles.forEach(file => {
				if (file.indexOf(tempDir) > -1) {
					let tmpFile = path.join(publicDir, file);
					if (fs.existsSync(tmpFile)) {
						let movedFile = this.moveFile(tmpFile);
						uploadedFiles.push(movedFile);
					}
				}
				else {
					uploadedFiles.push(file);
				}
			});
			return uploadedFiles.join(",");
		}
		return "";
	}
	moveFile(file) {
		let fileName = path.basename(file);
		let newFile = path.join(publicDir, this.uploadSettings.uploadDir, fileName);
		fs.renameSync(file, newFile);
		if (this.isImage(newFile)) {
			this.resizeImage(newFile);
		}

		let fileUrl = path.join(this.uploadSettings.uploadDir, fileName);
		if (this.uploadSettings.returnFullpath) {
			fileUrl = config.app.url + fileUrl;
		}
		fileUrl = fileUrl.replace(/\\/g, "/");
		return fileUrl;
	}
	isImage(file) {
		let imgExtensions = ["jpg", "png", "gif", "jpeg"];
		let fileExt = path.extname(file).substr(1).toLowerCase();
		return imgExtensions.includes(fileExt);
	}

	resizeImage(filePath) {
		let resizeSettings = this.uploadSettings.imageResize || [];

		resizeSettings.forEach(resize => {

			let fileName = path.basename(filePath);
			var uploadDir = this.uploadSettings.uploadDir || '';
			let newFileDir = path.join(publicDir, uploadDir, resize.name);

			if (!fs.existsSync(newFileDir)) {
				fs.mkdirSync(newFileDir);
			}

			let newFileName = path.join(newFileDir, fileName);

			let mode = resize.mode || "cover";

			let size = {
				fit: mode,
			};

			if (resize.width) {
				size.width = resize.width
			}

			if (resize.height) {
				size.height = resize.height
			}

			sharp(filePath).resize(size).toFile(newFileName).then(function (newFileInfo) {
				//console.log("Success")
			}).catch(function (err) {
				console.error("Image Resize Error occured", err);
			});
		});
	}
}

module.exports = Uploader;