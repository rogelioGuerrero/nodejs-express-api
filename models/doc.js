
const BaseModel = require("./basemodel");
class Doc extends BaseModel {
	static init(sequelize, Sequelize) {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true },
				seccion: {name: 'seccion', type:Sequelize.STRING},
				tema: {name: 'tema', type:Sequelize.STRING},
				iddoc: {name: 'idDoc', type:Sequelize.INTEGER}
			}, 
			{ 
				sequelize,
				
				tableName: "doc",
				modelName: "doc",
			}
		);
	}
	
	static listFields() {
		const sequelize = this.sequelize;
		return [
			'id', 
			'seccion', 
			'tema', 
			sequelize.literal('idDoc AS iddoc')
		];
	}

	static viewFields() {
		const sequelize = this.sequelize;
		return [
			'id', 
			'seccion', 
			'tema', 
			sequelize.literal('idDoc AS iddoc')
		];
	}

	static editFields() {
		const sequelize = this.sequelize;
		return [
			'seccion', 
			'tema', 
			sequelize.literal('idDoc AS iddoc'), 
			'id'
		];
	}

	
	static searchFields(){
		const sequelize = this.sequelize;
		return [
			sequelize.literal("seccion LIKE :search"), 
			sequelize.literal("tema LIKE :search"),
		];
	}

	
	
}
module.exports = Doc;
