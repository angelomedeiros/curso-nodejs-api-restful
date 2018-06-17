import * as mongoose       from 'mongoose'
import * as restify        from 'restify'
import { ModelRouter }     from '../common/model-router'
import { IReview, Review } from './reviews.model'

class ReviewsRouter extends ModelRouter<IReview> {
	constructor() {
		super(Review)
	}

	public envelope(document) {
		const resource = super.envelope(document)
		const restId = document.restaurant._id ? document.restaurant._id : document.restaurant
		resource._links.restaurant = `/restaurants/${restId}`
		return resource
	}

	// public findById = (req, resp, next) => {
	// 	this.model.findById(req.params.id)
	// 		.populate('restaurant', 'name')
	// 		.populate('user', 'name')
	// 		.then(this.render(resp, next))
	// 		.catch(next)
	// }

	public applyRoutes(application: restify.Server) {
		application.get(`${this.basePath}`, this.findAll)
		application.get(`${this.basePath}/:id`, [this.validateId, this.findById])
		application.post(`${this.basePath}`, this.save)
	}

	protected prepareOne(query: mongoose.DocumentQuery<IReview, IReview>):	mongoose.DocumentQuery<IReview, IReview> {
		return query.populate('restaurant', 'name')
								.populate('user', 'name')
	}

}

export const reviewsRouter = new ReviewsRouter()
