import { Server }        from 'restify'
import { NotFoundError } from 'restify-errors'
import { ModelRouter }   from '../common/model-router'
import { Restaurant }    from './restaurants.model'

class RestaurantsRouter extends ModelRouter<Restaurant> {
	constructor() {
		super(Restaurant)
	}

	envelope(document) {
		const resource = super.envelope(document)
		resource._links.menu = `${this.basePath}/${resource._id}/menu`
		return resource
	}

	public applyRoutes(application: Server) {
		application.get(`${this.basePath}`, this.findAll)
		application.get(`${this.basePath}/:id`, [this.validateId, this.findById])
		application.post(`${this.basePath}`, this.save)
		application.put(`${this.basePath}/:id`, [this.validateId, this.replace])
		application.patch(`${this.basePath}/:id`, [this.validateId, this.replace])
		application.del(`${this.basePath}/:id`, [this.validateId, this.delete])

		application.get(`${this.basePath}/:id/menu`, [this.validateId, this.findMenu])
		application.put(`${this.basePath}/:id/menu`, [this.validateId, this.replaceMenu])
	}

	private findMenu = (req, resp, next) => {
		Restaurant.findById(req.params.id, '+menu')
			.then(rest => {
				if (!rest) {
					throw new NotFoundError('Restaurente não encontrado')
				} else {
					resp.json(rest.menu)
					return next()
				}
			}).catch(next)
	}

	private replaceMenu = (req, resp, next) => {
		Restaurant.findById(req.params.id)
			.then(rest => {
				if (!rest) {
					throw new NotFoundError('Restaurente não encontrado')
				} else {
					rest.menu = req.body // Array de menuitem
					return rest.save()
				}
			}).then(rest => {
				resp.json(rest.menu)
				return next()
			}).catch(next)
	}

}

export const restaurantsRouter = new RestaurantsRouter()
