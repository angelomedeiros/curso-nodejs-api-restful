import 'jest'
import * as request 	 from 'supertest'
import { environment } from '../common/environment'

const address = (global as any).address

test('get /users', () => {
	return request(address)
		.get('/users')
		.then(response => {
			expect(response.status).toBe(200)
			expect(response.body.itens).toBeInstanceOf(Array)
		}).catch(fail)
})

test('post /users', () => {
	return request(address)
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

test('/get /users/123456 - Not found(404)', () => {
	return request(address)
		.get('/users/123456')
		.then(response => {
			expect(response.status).toBe(404)
		}).catch(fail)
})

test('/patch /users/:id', () => {
	return request(address)
		.post('/users')
		.send({
			email: 'usuario2@email.com',
			name: 'usuario2',
			password: '12345678',
		})
		.then(response => request(address)
											.patch(`/users/${response.body._id}`)
											.send({
												name: 'usuario2 - patch',
											}))
		.then(response => {
			expect(response.body._id).toBeDefined()
			expect(response.status).toBe(200)
			expect(response.body.name).toBe('usuario2 - patch')
			expect(response.body.email).toBe('usuario2@email.com')
			expect(response.body.password).toBeUndefined()
		})
		.catch(fail)
})
