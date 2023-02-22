
const express = require('express');
const router = express.Router();
const config = require('../config.js');
const DB = require('../models/index.js');
const utils = require('../helpers/utils.js');

const sequelize = DB.sequelize;
const Op = DB.Op; // sequelize query operators
const filterBy = DB.filterBy; // sequelize where condtion

router.get(['/', '/index'], async function (req, res)
{
    res.render('pages/index/welcome.html');
});



module.exports = router;
