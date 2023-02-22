const Sequelize = require("sequelize");
class BaseModel extends Sequelize.Model {
	static async findValue(column, where) {
		const row = await this.findOne({
			attributes: [column],
			where
		});

		if(row){
			return row[column];
		}
		return null;
	}

	static async paginate(query, page, limit) {
		query.offset = limit * (page - 1);
		query.limit = limit;
		let result = await this.findAndCountAll(query);
		let totalRecords = result.count;
		let records = result.rows;
		let recordCount = records.length;
		let totalPages = Math.ceil(totalRecords / limit);
		let data = {
			totalRecords,
			recordCount,
			totalPages,
			records
		}
		return data;
	}

	static getOrderBy(req, defaultOrderBy = 'desc') {
		let pk = this.primaryKeyAttributes[0];
		let orderby = req.query.orderby || pk;
		if (orderby) {
			let ordertype = req.query.ordertype || defaultOrderBy;
			let order = Sequelize.literal(`${orderby} ${ordertype}`);
			return [[order]];
		}
		return null;
	}
}
module.exports = BaseModel;