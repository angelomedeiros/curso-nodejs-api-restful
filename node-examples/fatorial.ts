export const fatorial = ( n ) => {
  if ( n == 0 ) {
    return 1
  }

  return n * fatorial ( n - 1 )
}

// exports.fatorial = fatorial
// para importar -> const fatorial = require('./fatorial').fatorial
// ou
// module.exports = {
//   fatorial
// }

// module.exports = fatorial
// para importar -> const fatorial = require('./fatorial')
