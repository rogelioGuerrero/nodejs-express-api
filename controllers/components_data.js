const express = require('express');
const router = express.Router();
const DB = require('../models/index.js');
const sequelize = DB.sequelize; // sequelize query functions
const Op = DB.Op; // sequelize query operators
const filterBy = DB.filterBy; // sequelize where condtion


 /**
 * Route to get seccion_option_list records
 * @route {GET} /components_data/seccion_option_list
 */
router.get('/seccion_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT id AS value,seccion AS label FROM seccion` ;
		let records = await DB.rawQuery(sqltext, { type: sequelize.QueryTypes.SELECT });
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get iddoc_option_list records
 * @route {GET} /components_data/iddoc_option_list
 */
router.get('/iddoc_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT  DISTINCT id AS value,seccion AS label FROM seccion` ;
		let records = await DB.rawQuery(sqltext, { type: sequelize.QueryTypes.SELECT });
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get name_option_list records
 * @route {GET} /components_data/name_option_list
 */
router.get('/name_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT  DISTINCT deep.depth AS value,deep.name AS label FROM deep` ;
		let records = await DB.rawQuery(sqltext, { type: sequelize.QueryTypes.SELECT });
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get lft_option_list records
 * @route {GET} /components_data/lft_option_list
 */
router.get('/lft_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT  DISTINCT lft AS value,name AS label,category_id AS caption FROM nested_category` ;
		let records = await DB.rawQuery(sqltext, { type: sequelize.QueryTypes.SELECT });
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get idseccion_option_list records
 * @route {GET} /components_data/idseccion_option_list
 */
router.get('/idseccion_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT  DISTINCT id AS value,seccionname AS label FROM secciones` ;
		let records = await DB.rawQuery(sqltext, { type: sequelize.QueryTypes.SELECT });
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to check if field value already exist in a Usuario table
 * @route {GET} /components_data/usuario_usuario_exist/{fieldvalue}
 */
router.get('/usuario_usuario_exist/:fieldvalue', async (req, res) => {
	try{
		let val = req.params.fieldvalue
		let count = await DB.Usuario.count({ where:{ 'usuario': val } });
		if(count > 0){
			return res.ok("true");
		}
		return res.ok("false");
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to check if field value already exist in a Usuario table
 * @route {GET} /components_data/usuario_email_exist/{fieldvalue}
 */
router.get('/usuario_email_exist/:fieldvalue', async (req, res) => {
	try{
		let val = req.params.fieldvalue
		let count = await DB.Usuario.count({ where:{ 'email': val } });
		if(count > 0){
			return res.ok("true");
		}
		return res.ok("false");
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get seccionid_list records
 * @route {GET} /components_data/seccionid_list
 */
router.get('/seccionid_list', async (req, res) => {
	try{
		let sqltext = `SELECT id AS value, seccion AS label, COUNT(*) AS num FROM seccion GROUP BY id` ;
		let records = await DB.rawQuery(sqltext, { type: sequelize.QueryTypes.SELECT });
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get tree_data_component records
 * @route {GET} /components_data/tree_data_component
 */
router.get('/tree_data_component', async (req, res) => {
	try{
		let sqltext = `SELECT node.name, (COUNT(parent.name) - (sub_tree.depth + 1)) AS depth
FROM nested_category AS node,
        nested_category AS parent,
        nested_category AS sub_parent,
        (
                SELECT node.name, (COUNT(parent.name) - 1) AS depth
                FROM nested_category AS node,
                        nested_category AS parent
                WHERE node.lft BETWEEN parent.lft AND parent.rgt
                        AND node.name = 'PORTABLE ELECTRONICS'
                GROUP BY node.name
                ORDER BY node.lft
        )AS sub_tree
WHERE node.lft BETWEEN parent.lft AND parent.rgt
        AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt
        AND sub_parent.name = sub_tree.name
GROUP BY node.name
HAVING depth = 1
ORDER BY node.lft;` ;
		let records = await DB.rawQuery(sqltext, { type: sequelize.QueryTypes.SELECT });
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get tree_data_repeater records
 * @route {GET} /components_data/tree_data_repeater
 */
router.get('/tree_data_repeater', async (req, res) => {
	try{
		let sqltext = `SELECT node.category_id, node.name, (COUNT(parent.name) - 1) AS depth
FROM nested_category AS node,
        nested_category AS parent
WHERE node.lft BETWEEN parent.lft AND parent.rgt
GROUP BY node.name
ORDER BY node.lft;` ;
		let records = await DB.rawQuery(sqltext, { type: sequelize.QueryTypes.SELECT });
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get tree_data_component_2 records
 * @route {GET} /components_data/tree_data_component_2
 */
router.get('/tree_data_component_2', async (req, res) => {
	try{
		let sqltext = `call addNodo('Televisions');` ;
		let records = await DB.rawQuery(sqltext, { type: sequelize.QueryTypes.SELECT });
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});
module.exports = router;
