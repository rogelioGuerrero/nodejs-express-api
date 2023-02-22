/**
 * Info Contoller Class
 * @category  Controller
 */
 
var express = require('express');
var router = express.Router();
router.get('/:page',  (req, res) => {
	var page =  "errors/" + req.params.page || 'errors/general';
	res.render('layouts/info.ejs', {page});
});
module.exports = router;