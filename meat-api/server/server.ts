import * as fs 									from 'fs'
import * as mongoose 						from 'mongoose'
import * as restify 						from 'restify'
import { environment } 					from '../common/environment'
import { Router } 							from '../common/router'
import { tokenParser } 					from '../security/token.parser'
import { handleError } 					from './error.handler'
import { mergePatchBodyParser } from './merge-patch.parser'

export class Server {
	public application: restify.Server

	public initializeDb(): mongoose.MongooseThenable {
		(mongoose as any).Promise = global.Promise
		return mongoose.connect(environment.db.url, {
			useMongoClient: true,
		})
	}

	public initRoutes(routers: Router[]): Promise<any> {
		return new Promise((resolve, reject) => {
			try {

				this.application = restify.createServer({
					certificate: fs.readFileSync('./security/keys/cert.pem'),
					key: fs.readFileSync('./security/keys/key.pem'),
					name: 'meat-api',
					version: '1.0.0',
				})

				this.application.use(restify.plugins.queryParser())
				this.application.use(restify.plugins.bodyParser())
				this.application.use(mergePatchBodyParser)
				this.application.use(tokenParser)

				// Routes
				for ( const router of routers ) {
					router.applyRoutes(this.application)
				}

				this.application.listen(environment.server.port, () => {
					resolve(this.application)
				})

				this.application.on('restifyError', handleError)

			} catch (error) {
				reject(error)
			}
		})
	}

	public bootstrap(routers: Router[] = []): Promise<Server> {
		return this.initializeDb().then(() =>
					 this.initRoutes(routers).then(() => this))
	}

	public shutdown() {
		return mongoose.disconnect().then(() => this.application.close())
	}
}
