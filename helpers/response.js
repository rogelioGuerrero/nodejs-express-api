
const constant = require("./constants")
module.exports = function(app)
{
	app.response.ok = function (message) {
		return this.send(message)
	}
	
	app.response.notFound = function (message) {
		message = message || constant.RecordNotFound;
		return this.status(404).send(message)
	}
	
	app.response.badRequest = function (message) {
		message = message || constant.BadRequest;
		return this.status(400).send(message)
	}
	
	app.response.forbidden = function (message) {
		message = message || constant.AccessForbbiden;
		return this.status(403).send(message)
	}
	
	app.response.unauthorized = function (message) {
		message = message || constant.UnauthorizedAccess;
		return this.status(401).send(message)
	}
	
	app.response.serverError = function (message) {
		console.error("Server Request Error", message);
		return this.status(500).send(constant.ServerError)
	}
}
