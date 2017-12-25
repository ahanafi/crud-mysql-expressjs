var express = require('express')
var app = express()
var mysql = require('mysql')
var myConnection = require('express-myconnection')
var config = require('./config/db')
var path = require('path')
var dbOptions = {
	host: config.database.host,
	user: config.database.user,
	password: config.database.password,
	port: config.database.port,
	database: config.database.db
}

var expressValidator = require('express-validator')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var flash = require('express-flash')
var cookieParser = require('cookie-parser');
var session = require('express-session');
var sessionStore = new session.MemoryStore;

app.use(myConnection(mysql, dbOptions, 'pool'))
app.set('view engine', 'pug')

/* Calling static files */
app.use(express.static(path.join(__dirname, 'bower_components')))
app.use(express.static(path.join(__dirname, 'public')))

app.use(expressValidator())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(methodOverride(function(req, res){
	if(req.body && typeof req.body === 'object' && '_method' in req.body) {
		var method = req.body._method
		delete req.body._method
		return method
	}
}))

app.use(cookieParser('keyboard cat'))
app.use(session({
	secret: 'keyboard cat',
	resave: true,
	store: sessionStore,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}))

app.use(flash())

app.use(function(req, res, next){
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});

/* Route List */
var index = require('./routes/index')
var users = require('./routes/users')

app.use('/', index)
app.use('/users', users)

app.listen(3000, function(){
	console.log("Server running at port 3000: http://127.0.0.1:3000")
})