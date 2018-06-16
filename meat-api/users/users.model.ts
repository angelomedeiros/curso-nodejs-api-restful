// const users = [
//  {id: '1', name: 'Angelo Medeiros', email: 'angelo@email.com'},
//  {id: '2', name: 'Thalita Oliverira', email: 'thalita@email.com'}
// ]

// export class User {
//  static findAll(): Promise<any[]>{
//    return Promise.resolve(users) 
//  }
//  static findById(id: string): Promise<any>{
//    return new Promise(resolve =>{
//      const filtered = users.filter(user => user.id === id)
//      let user = undefined
//      if (filtered.length > 0){
//        user = filtered[0]
//      }
//      resolve(user)
//    })  
//  }
// }

import * as bcrypt from 'bcrypt'
import * as mongoose from 'mongoose'
import { environment } from '../common/environment'
import {validateCPF} from '../common/validators'

export interface IUser extends mongoose.Document {
	name: string,
	email: string,
	password: string
}

export interface IUserModel extends mongoose.Model<IUser> {
	findByEmail(email: string): Promise<IUser>
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
})

userSchema.statics.findByEmail = function(email: string) {
	return this.findOne({ email })
}

const hashPassword = (obj, next) => {
	bcrypt.hash(obj.password, environment.secutity.saltRounds)
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

export const User = mongoose.model<IUser, IUserModel>('User', userSchema)
