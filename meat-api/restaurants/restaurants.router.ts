import { Server }        from 'restify'
import { NotFoundError } from 'restify-errors'
import { ModelRouter } 	 from '../common/model-router'
import { Restaurant }    from './restaurants.model'

class RestaurantsRouter extends ModelRouter<Restaurant> {
	constructor() {
		super(Restaurant)
	}

	public applyRoutes(application: Server) {
		application.get('/restaurants', this.findAll)
		application.get('/restaurants/:id', [this.validadeId, this.findById])
		application.post('/restaurants', this.save)
		application.put('/restaurants/:id', [this.validadeId, this.replace])
		application.patch('/restaurants/:id', [this.validadeId, this.replace])
		application.del('/restaurants/:id', [this.validadeId, this.delete])

		application.get('/restaurants/:id/menu', [this.validadeId, this.findMenu])
		application.put('/restaurants/:id/menu', [this.validadeId, this.replaceMenu])
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
