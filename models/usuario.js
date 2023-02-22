
const BaseModel = require("./basemodel");
class Usuario extends BaseModel {
	static init(sequelize, Sequelize) {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true },
				usuario: {name: 'usuario', type:Sequelize.STRING},
				password: {name: 'password', type:Sequelize.STRING},
				rut: {name: 'rut', type:Sequelize.STRING},
				nombres: {name: 'nombres', type:Sequelize.STRING},
				email: {name: 'email', type:Sequelize.STRING},
				registrado: {name: 'registrado', type:Sequelize.STRING},
				cuenta_id: {name: 'cuenta_id', type:Sequelize.INTEGER},
				open_id: {name: 'open_id', type:Sequelize.STRING},
				reset_token: {name: 'reset_token', type:Sequelize.STRING},
				created_at: {name: 'created_at', type:Sequelize.DATE},
				updated_at: {name: 'updated_at', type:Sequelize.DATE}
			}, 
			{ 
				sequelize,
				
				tableName: "usuario",
				modelName: "usuario",
			}
		);
	}
	
	static listFields() {
		
		return [
			'id', 
			'usuario', 
			'rut', 
			'nombres', 
			'email', 
			'registrado', 
			'cuenta_id', 
			'open_id', 
			'reset_token', 
			'created_at', 
			'updated_at'
		];
	}

	static viewFields() {
		
		return [
			'id', 
			'usuario', 
			'rut', 
			'nombres', 
			'email', 
			'registrado', 
			'cuenta_id', 
			'open_id', 
			'reset_token', 
			'created_at', 
			'updated_at'
		];
	}

	static accounteditFields() {
		
		return [
			'usuario', 
			'nombres', 
			'id', 
			'email'
		];
	}

	static accountviewFields() {
		
		return [
			'id', 
			'usuario', 
			'rut', 
			'nombres', 
			'email', 
			'registrado', 
			'cuenta_id', 
			'open_id', 
			'reset_token', 
			'created_at', 
			'updated_at'
		];
	}

	static editFields() {
		
		return [
			'id', 
			'usuario', 
			'rut', 
			'nombres', 
			'registrado', 
			'cuenta_id', 
			'open_id', 
			'reset_token'
		];
	}

	static seccionesFields() {
		
		return [
			'id', 
			'usuario', 
			'rut', 
			'nombres', 
			'email', 
			'registrado', 
			'cuenta_id', 
			'open_id', 
			'reset_token', 
			'created_at', 
			'updated_at'
		];
	}

	
	static searchFields(){
		const sequelize = this.sequelize;
		return [
			sequelize.literal("usuario LIKE :search"), 
			sequelize.literal("rut LIKE :search"), 
			sequelize.literal("nombres LIKE :search"), 
			sequelize.literal("email LIKE :search"), 
			sequelize.literal("reset_token LIKE :search"),
		];
	}

	
	
}
module.exports = Usuario;
