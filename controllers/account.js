const express = require('express');
const router = express.Router();
const config = require('../config');
const utils = require('../helpers/utils');
const uploader = require('../helpers/uploader');
const { body, validationResult, matchedData } = require('express-validator');


/**
 *  models
 * @const
 */
const DB = require('../models/index.js');
const Usuario = DB.Usuario;


const sequelize = DB.sequelize; // sequelize functions and operations
const Op = DB.Op; // sequelize query operators


/**
 * Route to view user account record
 * @route {GET} /account
 */
router.get(['/','/index'], async (req, res) => {
	try{
		let userId = recid = req.user.id;
		let query = {};
		let where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = Usuario.accountviewFields();
		let record = await Usuario.findOne(query);
		if(!record){
			return res.notFound();
		}
		return res.ok(record);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Usuario record for edit
 * @route {GET} /usuario/edit/{recid}
 */
router.get(['/edit'], async (req, res) => {
	try{
		const recid = req.user.id;
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = Usuario.accounteditFields();
		let record = await Usuario.findOne(query);
		if(!record){
			return res.notFound();
		}
		return res.ok(record);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to update  Usuario record
 * @route {POST} /usuario/edit/{recid}
 */
router.post(['/edit'] , 
	[
		body('usuario').optional({nullable: true}).not().isEmpty(),
		body('nombres').optional({nullable: true, checkFalsy: true}),
		body('email').optional({nullable: true, checkFalsy: true}).isEmail(),
	]
, async (req, res) => {
	try{
		let errors = validationResult(req); // get validation errors if any
		if (!errors.isEmpty()) {
			let errorMsg = utils.formatValidationError(errors.array());
			return res.badRequest(errorMsg);
		}
		const recid = req.user.id;
		let modeldata = matchedData(req, { locations: ['body'], includeOptionals: true }); // get validated data
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = Usuario.accounteditFields();
		let record = await Usuario.findOne(query);
		if(!record){
			return res.notFound();
		}
		await Usuario.update(modeldata, {where: where});
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});
router.get('/currentuserdata', async function (req, res)
{
	let user = req.user;
    return res.ok(user);
});


/**
 * Route to change user password
 * @route {POST} /account
 */
router.post('/changepassword' , 
	[
		body('oldpassword').not().isEmpty(),
		body('newpassword').not().isEmpty(),
		body('confirmpassword').not().isEmpty().custom((value, {req}) => (value === req.body.newpassword))
	]
, async function (req, res) {
	try{
		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			let errorMsg = utils.formatValidationError(errors.array());
			return res.badRequest(errorMsg);
		}
		let oldPassword = req.body.oldpassword;
		let newPassword = req.body.newpassword;
		let userId = req.user.id;
		let query = {};
		let where = {
			id: userId,
		};
		query.raw = true;
		query.where = where;
		query.attributes = ['password'];
		let user = await Usuario.findOne(query);
		let currentPasswordHash = user.password;
		if(!utils.passwordVerify(oldPassword, currentPasswordHash)){
			return res.badRequest("Current password is incorrect");
		}
		let modeldata = {
			password: utils.passwordHash(newPassword)
		}
		await Usuario.update(modeldata, {where: where});
		return res.ok("Password change completed");
	}
	catch(err){
		return res.serverError(err);
	}
});
module.exports = router;
