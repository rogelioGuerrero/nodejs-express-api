const express = require('express');
const router = express.Router();
const DB = require('../models/index.js');
const Deep = DB.Deep;


const sequelize = DB.sequelize; // sequelize query functions
const Op = DB.Op; // sequelize query operators
const filterBy = DB.filterBy; // sequelize where condtion




/**
 * Route to list deep records
 * @route {GET} /deep/index/{fieldname}/{fieldvalue}
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
			let searchFields = Deep.searchFields();
			where[Op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		if(queryFilters.length){
			where[Op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		if(req.query.orderby){
			query.order = Deep.getOrderBy(req, 'desc');
		}
		else{
			query.order = [];
			query.order.push(['depth', 'ASC']);
		}
		query.attributes = Deep.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await Deep.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});
module.exports = router;
