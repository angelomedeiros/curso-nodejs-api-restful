import * as restify 			from 'restify'
import { ForbiddenError } from 'restify-errors'

export const authorize: (...profiles: string[]) => restify.RequestHandler = (...profiles) => {
	return (req, resp, next) => {
		console.log('req.authenticated', req.authenticated)
		// console.log('req.authenticated.hasAny(...profiles)', req.authenticated)
		if (req.authenticated !== undefined && req.authenticated.hasAny(...profiles)) {
			next()
		} else {
			next( new ForbiddenError('Permissão negada'))
		}
	}
}
