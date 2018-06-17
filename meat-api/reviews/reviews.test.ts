import 'jest'
import * as request 	 from 'supertest'
import { environment } from '../common/environment'

const address = (global as any).address

test('get /reviews', () => {
	return request(address)
		.get('/reviews')
		.then(response => {
			expect(response.status).toBe(200)
			expect(response.body.itens).toBeInstanceOf(Array)
		}).catch(fail)
})
