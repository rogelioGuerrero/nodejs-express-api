
const BaseModel = require("./basemodel");
class Deep extends BaseModel {
	static init(sequelize, Sequelize) {
		return super.init(
			{
				
				name: { type: Sequelize.STRING, primaryKey: true  },
				depth: {name: 'depth', type:Sequelize.STRING},
				category_id: {name: 'category_id', type:Sequelize.INTEGER}
			}, 
			{ 
				sequelize,
				
				tableName: "deep",
				modelName: "deep",
			}
		);
	}
	
	static listFields() {
		
		return [
			'name', 
			'depth'
		];
	}

	static viewFields() {
		
		return [
			'name', 
			'depth', 
			'category_id'
		];
	}

	
	
	
}
module.exports = Deep;
