const DB = require('../models/index.js'); // sequelize db models
const config = require('../config.js');
const utils = require('./utils.js');
const Usuario = DB.Usuario;
const sequelize = DB.sequelize;
const Op = DB.Op; // sequelize query operators
module.exports = function(passport)
{
	var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
	var opts = {}
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	opts.secretOrKey = config.app.secret;
	passport.use(new JwtStrategy(opts, async(jwt_payload, done) => {
		try{
			let userId = jwt_payload.sub; //get user id from jwt
			if(userId){
				let user = await Usuario.findOne({where: { 'id': userId  }, attributes: {exclude:['password']} });
				done(null, user);
			}
			else{
				done(null, null);
			}
		}
		catch(err){
			done(err, null);
		}
	}));
}
