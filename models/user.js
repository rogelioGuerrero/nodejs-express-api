
const BaseModel = require("./basemodel");
class User extends BaseModel {
	static init(sequelize, Sequelize) {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true },
				username: {name: 'username', type:Sequelize.STRING},
				password: {name: 'password', type:Sequelize.STRING},
				mail: {name: 'mail', type:Sequelize.STRING}
			}, 
			{ 
				sequelize,
				
				tableName: "user",
				modelName: "user",
			}
		);
	}
	
	static listFields() {
		
		return [
			'id', 
			'username', 
			'mail'
		];
	}

	static viewFields() {
		
		return [
			'id', 
			'username', 
			'mail'
		];
	}

	static accounteditFields() {
		
		return [
			'id', 
			'username'
		];
	}

	static accountviewFields() {
		
		return [
			'id', 
			'username', 
			'mail'
		];
	}

	static editFields() {
		
		return [
			'id', 
			'username'
		];
	}

	
	static searchFields(){
		const sequelize = this.sequelize;
		return [
			sequelize.literal("username LIKE :search"), 
			sequelize.literal("mail LIKE :search"),
		];
	}

	
	
}
module.exports = User;
