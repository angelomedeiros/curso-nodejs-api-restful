import 'jest'
import * as request 	 from 'supertest'
import { environment } from '../common/environment'
import { Server } 		 from '../server/server'
import { User } 			 from './users.model'
import { usersRouter } from './users.router'

let server: Server

const port = 3001
const urlBase = request(`http://localhost:${port}`)

beforeAll(() => {
	environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db'
	environment.server.port = process.env.SERVER_PORT || port
	server = new Server()
	return server.bootstrap([usersRouter])
							 .then(() => User.remove({}).exec())
							 .catch(console.error)
})

test('get /users', () => {
	return urlBase
		.get('/users')
		.then(response => {
			expect(response.status).toBe(200)
			expect(response.body.itens).toBeInstanceOf(Array)
		}).catch(fail)
})

test('post /users', () => {
	return urlBase
		.post('/users')
		.send({
			cpf: '095.790.540-88',
			email: 'usuario@email.com',
			name: 'usuario1',
			password: '12345678',
		})
		.then(response => {
			expect(response.status).toBe(200)
			expect(response.body._id).toBeDefined()
			expect(response.body.name).toBe('usuario1')
			expect(response.body.email).toBe('usuario@email.com')
			expect(response.body.password).toBeUndefined()
			expect(response.body.cpf).toBe('095.790.540-88')
		}).catch(fail)
})

afterAll(() => {
	return server.shutdown()
})
