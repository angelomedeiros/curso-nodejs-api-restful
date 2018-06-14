// const fatorial = require('./fatorial').fatorial
import * as yargs from 'yargs'
import { fatorial } from './fatorial'
// const fatorial = require('./fatorial')

const argv = yargs.demandOption('num').argv
console.log('n-fatorial')

// console.log(`Executando o script a partir do diretório ${process.cwd()}`)

// process.on('exit', () => {
//   console.log('Script está prestes a terminar!')
// })


// Exibe os argumentos 'exececutados'
// console.log(process.argv)
// process.argv, retorna um array de strings

// Sem o yargs
// const num = parseInt(process.argv[2])

// Como o yargs
const num = argv.num

console.log(`Fatorial de ${num} é ${fatorial(num)}`)

// Para rodar esse script sem o yargs: node fatorial.js 4
// Para rodar esse script com o yargs: node fatorial.js --num=4

// Exibe os locais onde o require vai procurar os módulos
console.log(module.paths)

