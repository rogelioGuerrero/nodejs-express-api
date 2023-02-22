const express = require('express');
const router = express.Router();
const utils = require('../helpers/utils');
const { body, validationResult, matchedData } = require('express-validator');
const DB = require('../models/index.js');
const Nested_Category = DB.Nested_Category;


const sequelize = DB.sequelize; // sequelize query functions
const Op = DB.Op; // sequelize query operators
const filterBy = DB.filterBy; // sequelize where condtion




/**
 * Route to list nested_category records
 * @route {GET} /nested_category/index/{fieldname}/{fieldvalue}
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
			let searchFields = Nested_Category.searchFields();
			where[Op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		if(queryFilters.length){
			where[Op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = Nested_Category.getOrderBy(req, 'desc');
		query.attributes = Nested_Category.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await Nested_Category.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to view Nested_Category record
 * @route {GET} /nested_category/view/{recid}
 */
router.get(['/view/:recid'], async (req, res) => {
	try{
		const recid = req.params.recid || null;
		const query = {}
		const where = {}
		where['category_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = Nested_Category.viewFields();
		let record = await Nested_Category.findOne(query);
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
 * Route to insert Nested_Category record
 * @route {POST} /nested_category/add
 */
router.post('/add/' , 
	[
		body('name').not().isEmpty(),
		body('lft').not().isEmpty().isNumeric(),
		body('rgt').not().isEmpty().isNumeric(),
	]
, async function (req, res) {
	try{
		let errors = validationResult(req); // get validation errors if any
		if (!errors.isEmpty()) {
			let errorMsg = utils.formatValidationError(errors.array());
			return res.badRequest(errorMsg);
		}
		let modeldata = matchedData(req, { locations: ['body'] }); // get validated data
		
		//save Nested_Category record
		let record = await Nested_Category.create(modeldata);
		//await record.reload(); //reload the record from database
		const recid =  record['category_id'];
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Nested_Category record for edit
 * @route {GET} /nested_category/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['category_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = Nested_Category.editFields();
		let record = await Nested_Category.findOne(query);
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
 * Route to update  Nested_Category record
 * @route {POST} /nested_category/edit/{recid}
 */
router.post('/edit/:recid' , 
	[
		body('name').optional({nullable: true}).not().isEmpty(),
		body('lft').optional({nullable: true}).not().isEmpty().isNumeric(),
		body('rgt').optional({nullable: true}).not().isEmpty().isNumeric(),
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
		const query = {};
		const where = {};
		where['category_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = Nested_Category.editFields();
		let record = await Nested_Category.findOne(query);
		if(!record){
			return res.notFound();
		}
		await Nested_Category.update(modeldata, {where: where});
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Nested_Category record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @route {GET} /nested_category/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		where['category_id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await Nested_Category.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
		});
		await Nested_Category.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});
module.exports = router;
