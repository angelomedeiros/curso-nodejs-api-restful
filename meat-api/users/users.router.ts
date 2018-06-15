import * as restify from 'restify'
import { Router } from '../common/router'
import { User } from './users.model'

class UsersRouter extends Router {
	applyRoutes(application: restify.Server){

		application.get('/users', (req, resp, next) => {
			// resp.json({ message: 'users router' })
			User.find().then(users => {
				resp.json(users)
				return next()
			})
		})

		application.get('/users/:id', (req, resp, next) => {
			User.findById(req.params.id).then(user => {
				if (user){
					resp.json(user)
					return next()
				}
				resp.send(404)
				return next()
			})
		})

		application.post('/users', (req, resp, next) => {
			let user = new User(req.body)
			// Não muito prático, mais recomendado chamar o 
			// req.body no constructor do User()
			// user.name = req.body.name
			// user.email = req.body.email
			// user.password = req.body.password
			user.save().then( user => {
				user.password = undefined
				resp.json(user)
				return next()
			})
		})

		application.put('/users/:id', (req, resp, next) => {
			const options = { overwrite: true }
			User.update({_id: req.params.id}, req.body, options).exec()
			.then(result =>{
				if (result.n) {
					return User.findById(req.params.id)
				} else {
					resp.send(404)
				}
			}).then(user => {
				resp.json(user)
				return next()
			})
		})

		application.patch('/users/:id', (req, resp, next) => {
			const options = { new: true }
			User.findByIdAndUpdate(req.params.id, req.body, options).then(user => {
				if (user) {
					resp.json(user)
					return next()
				}
				resp.send(404)
				return next()
			})
		})

		application.del('/users/:id', (req, resp, next) => {
			User.remove({_id: req.params.id}).exec().then((cmdResult: any) => {
				if (cmdResult.result.n) {
					resp.send(204)
				} else {
					resp.send(404)
				}
				return next()
			})
		})

	}
}

export const usersRouter = new UsersRouter()