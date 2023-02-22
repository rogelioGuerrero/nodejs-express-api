
const Sequelize = require('sequelize');
const dbConfig    = require('../config.js').database;

const sequelize = new Sequelize(dbConfig.name, dbConfig.username, dbConfig.password, {
		dialect: dbConfig.type,
		host: dbConfig.host,
		port: dbConfig.port,
		pool: {
			max: 15,
			min: 5,
			idle: 20000,
			evict: 15000,
			acquire: 30000
		},
		define: {
			timestamps: false,
			freezeTableName: true
		},
		operatorsAliases: 0
	}
);


// Override timezone formatting
Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
	return this._applyTimezone(date, options).format('YYYY-MM-DD HH:mm:ss');
};

const Deep =  require("./deep").init(sequelize, Sequelize);
const Doc =  require("./doc").init(sequelize, Sequelize);
const Nested_Category =  require("./nested_category").init(sequelize, Sequelize);
const Seccion =  require("./seccion").init(sequelize, Sequelize);
const Secciones =  require("./secciones").init(sequelize, Sequelize);
const Temas =  require("./temas").init(sequelize, Sequelize);
const Usuario =  require("./usuario").init(sequelize, Sequelize);

const Op = Sequelize.Op;

const filterBy = function(expression, value){
	return sequelize.where(sequelize.literal(expression), value);
}

function rawQuery(queryText, options){
	return sequelize.query(queryText, options);
}

const raw = Sequelize.literal; // use to include raw expression

module.exports = {
	sequelize,
	Op,
	filterBy,
	raw,
	rawQuery,
	Deep,
	Doc,
	Nested_Category,
	Seccion,
	Secciones,
	Temas,
	Usuario
}
