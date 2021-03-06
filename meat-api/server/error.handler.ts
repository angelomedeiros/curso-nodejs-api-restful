import * as restify from 'restify'

export const handleError = (req: restify.Request, resp: restify.Response, err, done) => {
	err.toJSON =  () => {
		return {
			message: err.message,
		}
	}

	switch (err.name) {
		case 'MongoError':
			if (err.code === 11000) {
				err.statusCode = 400
			}
			break
		case 'ValidationError':
			err.statusCode = 400
			const messages: any[] = []
			for (const name of Object.keys(err.errors)) {
				messages.push({message: err.errors[name].message})
			}
			err.toJSON = () => ({
				errors: messages,
				message: 'Validacao error enquanto processava sua requisicao',
			})
			break
	}

	done()
}
