const express = require('express');
const router = express.Router();
const utils = require('../helpers/utils');
const { body, validationResult, matchedData } = require('express-validator');
const DB = require('../models/index.js');
const Usuario = DB.Usuario;


const sequelize = DB.sequelize; // sequelize query functions
const Op = DB.Op; // sequelize query operators
const filterBy = DB.filterBy; // sequelize where condtion




/**
 * Route to list usuario records
 * @route {GET} /usuario/index/{fieldname}/{fieldvalue}
 */
router.get(['/', '/index/:fieldname?/:fieldvalue?'], async (req, res) => {  
	try{
		let query = {};  // sequelize query object
		let queryFilters = [];
		let where = {};  // sequelize where conditions
		let replacements = {};  // sequelize query params
		let fieldName = req.params.fieldname;
		let fieldValue = req.params.fieldvalue;
		
		if (fieldName){
			queryFilters.push(filterBy(fieldName, fieldValue));
		}
		let search = req.query.search;
		if(search){
			let searchFields = Usuario.searchFields();
			where[Op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		if(queryFilters.length){
			where[Op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = Usuario.getOrderBy(req, 'desc');
		query.attributes = Usuario.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await Usuario.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to view Usuario record
 * @route {GET} /usuario/view/{recid}
 */
router.get(['/view/:recid'], async (req, res) => {
	try{
		const recid = req.params.recid || null;
		const query = {}
		const where = {}
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = Usuario.viewFields();
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
 * Route to insert Usuario record
 * @route {POST} /usuario/add
 */
router.post('/add/' , 
	[
		body('usuario').not().isEmpty(),
		body('password').not().isEmpty(),
		body('confirm_password', 'Passwords do not match').custom((value, {req}) => (value === req.body.password)),
		body('email').not().isEmpty().isEmail(),
	]
, async function (req, res) {
	try{
		let errors = validationResult(req); // get validation errors if any
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
		
		//save Usuario record
		let record = await Usuario.create(modeldata);
		//await record.reload(); //reload the record from database
		const recid =  record['id'];
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Usuario record for edit
 * @route {GET} /usuario/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = Usuario.editFields();
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
router.post('/edit/:recid' , 
	[
		body('usuario').optional({nullable: true}).not().isEmpty(),
		body('rut').optional({nullable: true, checkFalsy: true}),
		body('nombres').optional({nullable: true, checkFalsy: true}),
		body('registrado').optional({nullable: true}).not().isEmpty().isNumeric(),
		body('cuenta_id').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('open_id').optional({nullable: true}).not().isEmpty().isNumeric(),
		body('reset_token').optional({nullable: true, checkFalsy: true}),
	]
, async (req, res) => {
	try{
		let errors = validationResult(req); // get validation errors if any
		if (!errors.isEmpty()) {
			let errorMsg = utils.formatValidationError(errors.array());
			return res.badRequest(errorMsg);
		}
		const recid = req.params.recid;
		let modeldata = matchedData(req, { locations: ['body'], includeOptionals: true }); // get validated data
		
		// check if usuario already exist.
		let usuarioCount = await Usuario.count({where:{'usuario': modeldata.usuario, 'id': {[Op.ne]: recid} }});
		if(usuarioCount > 0){
			return res.badRequest(`${modeldata.usuario} already exist.`);
		}
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = Usuario.editFields();
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


/**
 * Route to delete Usuario record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @route {GET} /usuario/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await Usuario.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
		});
		await Usuario.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to list usuario records
 * @route {GET} /usuario/index/{fieldname}/{fieldvalue}
 */
router.get(['/secciones/:fieldname?/:fieldvalue?'], async (req, res) => {  
	try{
		let query = {};  // sequelize query object
		let queryFilters = [];
		let where = {};  // sequelize where conditions
		let replacements = {};  // sequelize query params
		let fieldName = req.params.fieldname;
		let fieldValue = req.params.fieldvalue;
		
		if (fieldName){
			queryFilters.push(filterBy(fieldName, fieldValue));
		}
		let search = req.query.search;
		if(search){
			let searchFields = Usuario.searchFields();
			where[Op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		if(queryFilters.length){
			where[Op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = Usuario.getOrderBy(req, 'desc');
		query.attributes = Usuario.seccionesFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await Usuario.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});
module.exports = router;
