
const BaseModel = require("./basemodel");
class Secciones extends BaseModel {
	static init(sequelize, Sequelize) {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true },
				seccionname: {name: 'seccionName', type:Sequelize.STRING}
			}, 
			{ 
				sequelize,
				
				tableName: "secciones",
				modelName: "secciones",
			}
		);
	}
	
	static listFields() {
		const sequelize = this.sequelize;
		return [
			sequelize.literal('seccionName AS seccionname'), 
			'id'
		];
	}

	static viewFields() {
		const sequelize = this.sequelize;
		return [
			sequelize.literal('seccionName AS seccionname'), 
			'id'
		];
	}

	static editFields() {
		const sequelize = this.sequelize;
		return [
			sequelize.literal('seccionName AS seccionname'), 
			'id'
		];
	}

	
	static searchFields(){
		const sequelize = this.sequelize;
		return [
			sequelize.literal("seccionName LIKE :search"),
		];
	}

	
	
}
module.exports = Secciones;
