
const BaseModel = require("./basemodel");
class Nested_Category extends BaseModel {
	static init(sequelize, Sequelize) {
		return super.init(
			{
				
				category_id: { type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true },
				name: {name: 'name', type:Sequelize.STRING},
				lft: {name: 'lft', type:Sequelize.INTEGER},
				rgt: {name: 'rgt', type:Sequelize.INTEGER}
			}, 
			{ 
				sequelize,
				
				tableName: "nested_category",
				modelName: "nested_category",
			}
		);
	}
	
	static listFields() {
		
		return [
			'category_id', 
			'name', 
			'lft', 
			'rgt'
		];
	}

	static viewFields() {
		
		return [
			'category_id', 
			'name', 
			'lft', 
			'rgt'
		];
	}

	static editFields() {
		
		return [
			'name', 
			'lft', 
			'rgt', 
			'category_id'
		];
	}

	
	static searchFields(){
		const sequelize = this.sequelize;
		return [
			sequelize.literal("name LIKE :search"),
		];
	}

	
	
}
module.exports = Nested_Category;
