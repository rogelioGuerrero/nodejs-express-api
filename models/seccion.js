
const BaseModel = require("./basemodel");
class Seccion extends BaseModel {
	static init(sequelize, Sequelize) {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true  },
				seccion: {name: 'seccion', type:Sequelize.STRING}
			}, 
			{ 
				sequelize,
				
				tableName: "seccion",
				modelName: "seccion",
			}
		);
	}
	
	static listFields() {
		
		return [
			'id', 
			'seccion'
		];
	}

	
	static searchFields(){
		const sequelize = this.sequelize;
		return [
			sequelize.literal("seccion LIKE :search"),
		];
	}

	
	
}
module.exports = Seccion;
