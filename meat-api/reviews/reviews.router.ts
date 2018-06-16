import * as mongoose       from 'mongoose'
import * as restify        from 'restify'
import { ModelRouter }     from '../common/model-router'
import { IReview, Review } from './reviews.model'

class ReviewsRouter extends ModelRouter<IReview> {
	constructor() {
		super(Review)
	}

	// public findById = (req, resp, next) => {
	// 	this.model.findById(req.params.id)
	// 		.populate('restaurant', 'name')
	// 		.populate('user', 'name')
	// 		.then(this.render(resp, next))
	// 		.catch(next)
	// }

	public applyRoutes(application: restify.Server) {
		application.get('/reviews', this.findAll)
		application.get('/reviews/:id', [this.validadeId, this.findById])
		application.post('/reviews', this.save)
	}

	protected prepareOne(query: mongoose.DocumentQuery<IReview, IReview>):	mongoose.DocumentQuery<IReview, IReview> {
		return query.populate('restaurant', 'name')
								.populate('user', 'name')
	}

}

export const reviewsRouter = new ReviewsRouter()
