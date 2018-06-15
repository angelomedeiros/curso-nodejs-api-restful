import * as restify from 'restify'
import { ModelRouter } from '../common/model-router'
import { NotFoundError } from 'restify-errors'
import { User } from './users.model'

class UsersRouter extends ModelRouter<User> {
	constructor () {
		super(User)
		this.on('beforeRender', document => {
			document.password = undefined
		})
	}

	applyRoutes(application: restify.Server){
		application.get('/users', this.findAll)
		application.get('/users/:id', [this.validadeId, this.findById])
		application.post('/users', this.save)
		application.put('/users/:id', [this.validadeId, this.replace])
		application.patch('/users/:id', [this.validadeId, this.replace])
		application.del('/users/:id', [this.validadeId, this.delete])
	}
}

export const usersRouter = new UsersRouter()