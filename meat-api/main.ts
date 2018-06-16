import { restaurantsRouter } from './restaurants/restaurants.router'
import { Server } from './server/server'
import { usersRouter } from './users/users.router'

const server = new Server()

server.bootstrap([
	usersRouter,
	restaurantsRouter,
	]).then( address => {
	console.log('Server is listening on:', address.application.address())
}).catch(error => {
	console.log('Server failed to start')
	console.error(error)
	process.exit(1)
})
