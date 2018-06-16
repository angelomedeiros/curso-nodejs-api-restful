import * as restify      from 'restify'
import { NotFoundError } from 'restify-errors'
import { ModelRouter }   from '../common/model-router'
import { IUser, User }          from './users.model'

class UsersRouter extends ModelRouter<IUser> {
	constructor() {
		super(User)
		this.on('beforeRender', document => {
			document.password = undefined
		})
	}

	public applyRoutes(application: restify.Server) {
		application.get({path: '/users', version: '2.0.0'}, [this.findByEmail, this.findAll])
		application.get({path: '/users', version: '1.0.0'}, this.findAll)
		application.get('/users/:id', [this.validadeId, this.findById])
		application.post('/users', this.save)
		application.put('/users/:id', [this.validadeId, this.replace])
		application.patch('/users/:id', [this.validadeId, this.replace])
		application.del('/users/:id', [this.validadeId, this.delete])
	}

	private findByEmail = (req, respo, next) => {
		if (req.query.email) {
			User.findByEmail(req.query.email)
					.then(user => user ? [user] : [])
					.then(this.renderAll(respo, next))
					.catch(next)
		} else {
			next()
		}
	}

}

export const usersRouter = new UsersRouter()
