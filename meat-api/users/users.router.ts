import * as restify      from 'restify'
import { NotFoundError } from 'restify-errors'
import { ModelRouter }   from '../common/model-router'
import { authenticate }	 from '../security/auth.handler'
import { authorize } 			 from '../security/authz.handler'
import { User }   from './users.model'

class UsersRouter extends ModelRouter<User> {
	constructor() {
		super(User)
		this.on('beforeRender', document => {
			document.password = undefined
		})
	}

	public applyRoutes(application: restify.Server) {
		application.get(
			{path: `${this.basePath}`, version: '2.0.0'},	[
			authorize('admin', 'user'),
			this.findByEmail,
			this.findAll,
			])
		application.get({path: `${this.basePath}`, version: '1.0.0'}, [authorize('admin'), this.findAll])
		application.get(`${this.basePath}/:id`, [authorize('admin', 'user'), this.validateId, this.findById])
		application.post(`${this.basePath}`, [authorize('admin'), this.save])
		application.put(`${this.basePath}/:id`, [authorize('admin', 'user'), this.validateId, this.replace])
		application.patch(`${this.basePath}/:id`, [authorize('admin', 'user'), this.validateId, this.update])
		application.del(`${this.basePath}/:id`, [authorize('admin'), this.validateId, this.delete])

		application.post(`${this.basePath}/authenticate`, authenticate)
	}

	private findByEmail = (req, respo, next) => {
		if (req.query.email) {
			User.findByEmail(req.query.email)
					.then(user => user ? [user] : [])
					.then(this.renderAll(respo, next, {
						pageSize: this.pageSize,
						url: req.url,
					}))
					.catch(next)
		} else {
			next()
		}
	}

}

export const usersRouter = new UsersRouter()
