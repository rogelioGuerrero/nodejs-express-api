

/**
* Report Contoller Class
* @category  Controller
*/
const express = require('express');
const router = express.Router();
const config = require('../config.js');

router.post('/',  (req, res) => {
	let title = req.body.title || '';
	data = req.body.data || ''
	res.render('layouts/report.ejs', {title, data, config});
});

module.exports = router;
