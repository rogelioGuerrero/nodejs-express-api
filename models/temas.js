
const BaseModel = require("./basemodel");
class Temas extends BaseModel {
	static init(sequelize, Sequelize) {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true },
				idseccion: {name: 'idSeccion', type:Sequelize.INTEGER},
				tema: {name: 'tema', type:Sequelize.STRING},
				descripcion: {name: 'descripcion', type:Sequelize.STRING}
			}, 
			{ 
				sequelize,
				
				tableName: "temas",
				modelName: "temas",
			}
		);
	}
	
	static listFields() {
		
		return [
			'tema', 
			'descripcion', 
			'id'
		];
	}

	static viewFields() {
		
		return [
			'tema', 
			'descripcion', 
			'id'
		];
	}

	static editFields() {
		const sequelize = this.sequelize;
		return [
			sequelize.literal('idSeccion AS idseccion'), 
			'tema', 
			'descripcion', 
			'id'
		];
	}

	
	static searchFields(){
		const sequelize = this.sequelize;
		return [
			sequelize.literal("tema LIKE :search"),
		];
	}

	
	
}
module.exports = Temas;
