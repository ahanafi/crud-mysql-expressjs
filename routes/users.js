var express = require('express')
var app = express()

/* User Index */
app.get('/', function(req, res, next){
	req.getConnection(function(err, conn){
		if(err) {
			throw err
		} else {
			conn.query("SELECT * FROM users ORDER BY id ASC", function(err, rows, fields){
				if(err) {
					req.flash('error', err)
					res.render('users/index', {
						title: 'List Users',
						data: ''
					})
				} else {
					res.render('users/index', {
						title: 'List Users',
						data: rows
					})
				}
			})
		}
	})
})

/* User Add */
app.get('/add', function(req, res, next){
	res.render('users/add', {
		title: 'Add New User',
		user: {
			name: '',
			age: '',
			gender: '',
			email: '',
			address: ''
		}
	})
})

/* Proccess Add User */
app.post('/add', function(req, res, next){
	req.assert('name', 'Name is required').notEmpty()
	req.assert('age', 'Age is required').notEmpty()
	req.assert('gender', 'Gender is required').notEmpty()
	req.assert('email', 'E-mail is required').notEmpty()
	req.assert('address', 'Address is required').notEmpty()

	var errors = req.validationErrors()

	if(errors === false) {
		var user = {
			name: req.sanitize('name').escape(),
			age:  req.sanitize('age').escape(),
			gender: req.sanitize('gender').escape(),
			email: req.sanitize('email').escape(),
			address: req.sanitize('address').escape()
		}

		req.getConnection(function(err, conn){
			conn.query("INSERT INTO users SET ?", user, function(err, result){
				if(err) {
					req.flash('error', err)

					res.render('users/form-add', {
	                        title: 'Add New User',
	                        name: user.name,
	                        age: user.age,
	                        gender: user.gender,
	                        email: user.email,
	                        address: user.address                 
	                    })
				} else {
					req.flash('success', 'Data was successfully added!')
					res.redirect('/users')
				}
			})
		})
	} else {
		var error_msg = []

		errors.forEach(function(error){
			error_msg.push(error.msg)
		})

		req.flash('danger', error_msg)
		res.redirect('/users/add')
	}
})

/* Update User */
app.get('/edit/:id', function(req, res){
	req.getConnection(function(err, conn){
		if(err) {
			throw err
		} else {
			var sql = "SELECT * FROM users WHERE ? LIMIT 1"
			var id = {
				id : req.params.id
			}

			conn.query(sql, id, function(err, rows){
				if(err) {
					throw err;
				} else {
					if(rows.length > 0) {
						res.render('users/update', {
							title: 'Update User Data',
							user: rows[0]
						})
					} else {
						res.render('users/not-found', {
							id: req.params.id
						})
					}
				}
			})
		}
	})
})

/* Proccess Update User */
app.post('/edit/:id', function(req, res, next){
	req.assert('name', 'Name is required').notEmpty()
	req.assert('age', 'Age is required').notEmpty()
	req.assert('gender', 'Gender is required').notEmpty()
	req.assert('email', 'E-mail is required').notEmpty().isEmail()
	req.assert('address', 'Address is required').notEmpty()

	var errors = req.validationErrors()

	if(errors === false) {
		var user = {
			name: req.sanitize('name').escape(),
			age:  req.sanitize('age').escape(),
			gender: req.sanitize('gender').escape(),
			email: req.sanitize('email').escape(),
			address: req.sanitize('address').escape()
		}

		var id = { id: req.params.id }
		var data = [user, id]
		
		req.getConnection(function(err, conn){
			if(err) {
				throw err
			} else {
				conn.query("UPDATE users SET ? WHERE ?", data, function(err, row){
					if(err) {
						throw err
					} else {
						res.redirect('/users')
					}
				})
			}
		})
	} else {
		var error_msg = []

		errors.forEach(function(error){
			error_msg.push(error.msg)
		})

		req.flash('danger', error_msg)
		res.redirect('/users/edit/' + req.params.id)
	}

})

/* Procces Delete User */
app.post('/delete/:id', function(req, res, next){
	req.getConnection(function(err, conn){
		if(err) {
			throw err
		} else {
			var id = {
				id: req.params.id
			}

			conn.query("DELETE FROM users WHERE ?", id, function(err, row){
				if(err) {
					req.flash('error', ' Failed to delete this data!')
					res.redirect('/users')
				} else {
					req.flash('success', ' Data was successfully deleted!')
					res.redirect('/users')
				}
			})
		}
	})
})

module.exports = app;