import * as bcrypt 		 from 'bcrypt'
import * as mongoose	 from 'mongoose'
import { environment } from '../common/environment'
import {validateCPF} 	 from '../common/validators'

export interface User extends mongoose.Document {
	cpf: string,
	email: string,
	gender: string,
	password: string,
	name: string,
	profiles: string[],
	matches(password: string): boolean,
	hasAny(...profiles: string[]): boolean
}

export interface IUserModel extends mongoose.Model<User> {
	findByEmail(email: string, projection?: string): Promise<User>
}

const userSchema = new mongoose.Schema({
	cpf: {
		required: false,
		type: String,
		validate: {
			message: '{PATH}: Invalid CPF ({VALUE})',
			validator: validateCPF,
		},
	},
	email: {
		match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		required: true,
		type: String,
		unique: true,
	 },
	gender: {
		enum: [ 'Male', 'Female' ],
		required: false,
		type: String,
	},
	name: {
		maxlength: 80,
		minlength: 3,
		required: true,
		type: String,
	},
	password: {
		required: true,
		select: false,
		type: String,
	},
	profiles: {
		required: false,
		type: [String],
	},
})

userSchema.statics.findByEmail = function(email: string, projection: string) {
	return this.findOne({ email }, projection)
}

userSchema.methods.matches = function(password: string): boolean {
	return bcrypt.compareSync(password, this.password)
}

userSchema.methods.hasAny = function(...profiles: string[]): boolean {
	return profiles.some(profile => this.profiles.indexOf(profile) !== -1)
}

const hashPassword = (obj, next) => {
	bcrypt.hash(obj.password, environment.security.saltRounds)
			.then(hash => {
				obj.password = hash
				next()
			}).catch(next)
}

const saveMiddleware = function(next) {
	const user: User = this
	if (!user.isModified('password')) {
		next()
	} else {
		hashPassword(user, next)
	}
}

const updateMiddleware = function(next) {
	if (!this.getUpdate().password) {
		next()
	} else {
		hashPassword(this.getUpdate(), next)
	}
}

userSchema.pre('save', saveMiddleware)
userSchema.pre('update', updateMiddleware)
userSchema.pre('findOneAndUpdate', updateMiddleware)

export const User = mongoose.model<User, IUserModel>('User', userSchema)
