"use strict";
// const users = [
// 	{id: '1', name: 'Angelo Medeiros', email: 'angelo@email.com'},
// 	{id: '2', name: 'Thalita Oliverira', email: 'thalita@email.com'}
// ]
Object.defineProperty(exports, "__esModule", { value: true });
// export class User {
// 	static findAll(): Promise<any[]>{
// 		return Promise.resolve(users)	
// 	}
// 	static findById(id: string): Promise<any>{
// 		return new Promise(resolve =>{
// 			const filtered = users.filter(user => user.id === id)
// 			let user = undefined
// 			if (filtered.length > 0){
// 				user = filtered[0]
// 			}
// 			resolve(user)
// 		})	
// 	}
// }
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        select: false
    }
});
exports.User = mongoose.model('User', userSchema);
