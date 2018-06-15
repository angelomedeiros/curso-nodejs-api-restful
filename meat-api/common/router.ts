import * as restify from 'restify'
import { EventEmitter } from 'events'

export abstract class Router extends EventEmitter {
	abstract applyRoutes(application: restify.Server)

	render(response: restify.Response, next: restify.Next){
		return (document) => {
			if (document) {
				this.emit('beforeRender', document)
				response.json(document)
			} else {
				response.send(404)
			}
			return next()
		}
	}
}

// Routes

// this.application.get('/hello', (req, resp, next) => {
// 	// As duas linhas de baixo(contentType e send) representam o resp.json
// 	resp.contentType = 'application/json'
// 	resp.send({ mensagem: 'Hello world!' })
// 	// resp.json({message: 'hello'})

// 	// Altera o status
// 	resp.status(200)

// 	// Altera o contentType
// 	// resp.contentType = 'application/json'
// 	// resp.setHeader('Content-Type', 'application/json')
// 	return next()
// })

// // Obtem os parâmetros passados na url

// this.application.get('/info', [
// 	(req, resp, next) => {
// 		if (req.userAgent() && req.userAgent().includes('MSIE 7.0')){
// 			// resp.status(400)
// 			// resp.json({ message: 'Por favor, atualize seu browser' })
// 			// return next(false)
// 			let error: any = new Error()
// 			error.statusCode = 400
// 			error.message = 'Por favor pnc, tome vergonha!'
// 			return next(error)
// 		}
// 		return next()
// 	},
// 	(req, resp, next) => {
// 		resp.json({
// 			browser: req.userAgent(),
// 			method: req.method,
// 			url: req.url,
// 			href: req.href(),
// 			path: req.path(),
// 			query: req.query
// 	})
// 	return next()
// }])
