var express = require('express')
var app = express()

app.get('/', function(req, res){
	res.render('index', {
		title: 'CRUD Application with ExpressJS',
		subtitle: `Create, Read, Update, and Delete with ExpressJS and MySQL as a database engine.
		To show the data, click at bellow button.
		`
	})
})

app.get('/about', function(req, res){
	res.render('about', {
		title: 'About App',
		subtitle: 'CRUD App with ExpressJS and MySQL v0.0.1',
		author: {
			name :'Ahmad Hanafi',
			img : 'img/author.png',
		},
		social: {
			fb: "https://facebook.com/ahmaddhanavie",
			github: "https://github.com/ahmaddhanavie",
		},
		website: "http://hannavie.hol.es"
	})
})

module.exports = app;