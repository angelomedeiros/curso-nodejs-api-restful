export const environment = {
	db: { url: process.env.DB_URL || 'mongodb://localhost/meat-api' },
	secutity: { saltRounds: process.env.SALT_ROUNDS || 10 },
	server: { port: process.env.SERVER_PORT || 3000 },
}
