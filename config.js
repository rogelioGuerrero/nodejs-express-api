var config = {
	app: {
		name: "test",
		url: "https://apitest-z2cb.onrender.com/api",
		frontendUrl: "http://localhost:8050",
		secret: "dabf4f38c819171cbc49e0a27fbfb0e8",
		language: "spanish",
		publicDir: "assets",
	},
	meta: {
		author:"",
		description: "__metadescription",
		charset: "UTF-8",
	},
	auth: {
		jwtDuration: 30, //in minutes
		otpDuration: 5, //in minutes
	},
	database: {
		name:"db_a7aff4_mec",
		type: "mysql",
		host: "mysql5037.site4now.net",
		username: "a7aff4_mec",
		password: "A123456z",
		port: "3306",
		charset: "utf8",
		recordlimit: 10,
		ordertype: "DESC"
	},
	mail: {
		username:"rg@uoc.edu",
		password: "A123456z",
		senderemail:"rg@uoc.edu",
		sendername:"jose",
		host: "smtp.gmail.com",
		secure: true,
		port: "465"
	},
	upload: {
		tempDir: "uploads/temp/",
		import_data: {
			filenameType: "timestamp",
			extensions: "json,csv",
			limit: "10",
			maxFileSize: "3",
			returnFullpath: "false",
			filenamePrefix: "",
			uploadDir: "uploads/files/"
		},
		
	},
	s3: {
		secretAccessKey: "",
		accessKeyId: "",
		region: "",
		bucket: "",
	},
	
}
module.exports = config