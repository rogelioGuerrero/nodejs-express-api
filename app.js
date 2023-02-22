/** Express Server App
 * @module server/app
 * @requires express
 * @requires config - app configigurations
 * @requires path- path module
 * @requires cors- Enable cors for all routes
 * @requires auth/passport passport auth using JWTStrategy
 * @requires helpers/response Http Response Status Code
 */


const express = require('express');
const path = require('path');
const config = require('./config.js');
const cors = require('cors');


const app = express();

//set view engine use to return Html
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
require('./helpers/response')(app);
app.use(cors());
app.use(express.static(config.app.publicDir));
const passport = require('passport');
require('./helpers/passport-auth')(passport);
app.use(express.json()) // Parses json, multi-part (file), url-encoded
app.use(express.urlencoded({extended:true, limit:'50mb'}));

//login user and pass user to req.user object
app.use('/api',
	async (req, res, next) => {
		passport.authenticate('jwt', async (err, user, info) => {
			req.login(user, { session: false }, async (error) => {});
			return next();
		}
		)(req, res, next);
	}
);
// convert blank fields to null.
// trim string inputs
app.use((req, res, next) => {
    if (req.body) {
        const sanitizeInput = require('./helpers/sanitizeinput');
        sanitizeInput(req.body);
    };
    next();
});

//bind page route to the controllers
app.use('/api/', require('./controllers/home.js'));
app.use('/api/components_data', require('./controllers/components_data.js'));
app.use('/api/fileuploader', require('./controllers/fileuploader.js'));
app.use('/api/s3uploader', require('./controllers/s3uploader.js'));
app.use('/api/auth', require('./controllers/auth.js'));

//protect all /api endpoints
app.use('/api', async (req, res, next) => {
	if(req.user){
		return next();//user is authenticated
	}
	return res.unauthorized();
});
app.use('/api/account', require('./controllers/account.js'));
app.use('/api/deep', require('./controllers/deep.js'))
app.use('/api/doc', require('./controllers/doc.js'))
app.use('/api/nested_category', require('./controllers/nested_category.js'))
app.use('/api/seccion', require('./controllers/seccion.js'))
app.use('/api/secciones', require('./controllers/secciones.js'))
app.use('/api/temas', require('./controllers/temas.js'))
app.use('/api/usuario', require('./controllers/usuario.js'))
app.get('*', function(req, res){
    res.status(404).json("Page not found");
});

let port = 8060;
//start app
app.listen(port, () => {
    console.log('Server is up and running on port: ' + port);
});