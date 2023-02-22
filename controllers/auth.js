const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('../config');
const utils = require('../helpers/utils');
const jwt = require('jsonwebtoken');
const { body, validationResult, matchedData } = require('express-validator');


const DB = require('../models/index.js');
const Usuario = DB.Usuario;


const sequelize = DB.sequelize; // sequelize functions and operations
const Op = DB.Op; // sequelize query operators
const filterBy = DB.filterBy; // sequelize where condtion


/**
 * Generate jwt token
 * @param {string} userId - current user id
 * @param {string} expiresIn - token expiration duration
 */
function generateUserToken(user){
	let expiresIn = config.auth.jwtDuration + 'm' //in minutes;
	let userid = user.id;
	let token = jwt.sign({sub: userid}, config.app.secret, { expiresIn });
	return token;
}


/**
 * Get userid from jwt token
 * @param {string} token
 */
function getUserIDFromJwt(token){
	try {
		let decoded = jwt.verify(token, config.app.secret);
		return decoded.sub
	}
	catch (err) {
		throw new Error(err);
	}
}


/**
 * Return user login data
 * @param {object} user - current user
 */
async function getUserLoginData(user){
	// generate a signed jwt for the user
	let token = generateUserToken(user); //generate token duration
	return { token }; //return user object and token
}


/**
 * Route to login user using credential
 * @route {POST} /auth/login
 */
router.post('/login', [
		body('username').trim().not().isEmpty(),
		body('password').not().isEmpty(),
	], async (req, res, next) => {
	try{
		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			let errorMsg = utils.formatValidationError(errors.array());
			return res.badRequest(errorMsg);
		}
		let { username, password } = req.body;
		let user = await Usuario.findOne({where: { 'usuario': username}});
		if(!user){
			return res.unauthorized("Nombre de usuario o contraseña no correctos");
		}
		if(!utils.passwordVerify(password, user.password)){
			return res.unauthorized("Nombre de usuario o contraseña no correctos");
		}
		let loginData = await getUserLoginData(user);
		return res.ok(loginData);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to register new user
 * @route {POST} /auth/register
 */
router.post('/register', 
	[
		body('usuario').not().isEmpty(),
		body('password').not().isEmpty(),
		body('confirm_password', 'Passwords do not match').custom((value, {req}) => (value === req.body.password)),
		body('email').not().isEmpty().isEmail(),
	]
, async function (req, res) {
	try{
		// Finds the validation errors in this request and convert to specific format
		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			let errorMsg = utils.formatValidationError(errors.array());
			return res.badRequest(errorMsg);
		}
		let modeldata = matchedData(req, { locations: ['body'] }); // get validated data
		modeldata.password = utils.passwordHash(modeldata.password);
		
		// check if usuario already exist.
		let usuarioCount = await Usuario.count({ where:{ 'usuario': modeldata.usuario } });
		if(usuarioCount > 0){
			return res.badRequest(`${modeldata.usuario} already exist.`);
		}
		
		// check if email already exist.
		let emailCount = await Usuario.count({ where:{ 'email': modeldata.email } });
		if(emailCount > 0){
			return res.badRequest(`${modeldata.email} already exist.`);
		}
		
		let record = user = await Usuario.create(modeldata); // user record
		await user.reload();
		const recid =  record['id'];
		
		let loginData = await getUserLoginData(user);
		return res.ok(loginData);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to send password reset link to user email
 * @route {POST} /auth/forgotpassword
 */
router.post('/forgotpassword', [
		body('email').not().isEmpty().isEmail(),
	], async (req, res) => {
	try{
		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			let errorMsg = utils.formatValidationError(errors.array());
			return res.badRequest(errorMsg);
		}
		const modeldata = matchedData(req, { locations: ['body'] }); // get the validated data
		const email = modeldata.email;
		const user = await Usuario.findOne({where: { 'email': email} });
		if(!user){
			return res.notFound("Email not registered");
		}
		await sendPasswordResetLink(user);
		
		return res.ok("We have emailed your password reset link!");
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to reset user password
 * @route {POST} /auth/resetpassword
 */
router.post('/resetpassword', [
		body('password').not().isEmpty().custom((val, { req, loc, path }) => {
			if (val !== req.body.confirm_password) {
				throw new Error("Passwords confirmation does not match");
			} else {
				return val;
			}
        }),
	],  async (req, res) => {
	try{
		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			let errorMsg = utils.formatValidationError(errors.array());
			return res.badRequest(errorMsg);
		}
		let token = req.body.token;
		let userid = getUserIDFromJwt(token)  //get user id from token payload
		let password = req.body.password;
		let where = {id: userid }
		let record = await Usuario.findOne({where: where})
		if(!record){
			return res.notFound("User not found");
		}
		var newPassword = bcrypt.hashSync(password, 10);
		var modeldata = {password: newPassword}
		await Usuario.update(modeldata, {where: where});
		
		return res.ok("Password changed");
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Send password reset link to user email 
*/
async function sendPasswordResetLink(user){
	let token = generateUserToken(user);
	let resetlink = `${config.app.frontendUrl}/#/index/resetpassword?token=${token}`;
	let username = user.usuario;
	let email = user.email;
	let mailtitle = 'Password Reset';
	
	let ejs = require('ejs');
	
	let viewData = { username, email, resetlink, config };
	let mailbody = await ejs.renderFile("views/pages/index/password_reset_email_template.ejs", viewData);
	
	let mailer = require('../helpers/mailer.js');
	let mailResult = await mailer.sendMail(email, mailtitle, mailbody);
	if(!mailResult.messageId){
		throw new Error(mailResult.error);
	}
	return true;
}
module.exports = router;
