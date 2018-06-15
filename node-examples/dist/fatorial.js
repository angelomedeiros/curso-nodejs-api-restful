"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fatorial = (n) => {
    if (n == 0) {
        return 1;
    }
    return n * exports.fatorial(n - 1);
};
// exports.fatorial = fatorial
// para importar -> const fatorial = require('./fatorial').fatorial
// ou
// module.exports = {
//   fatorial
// }
// module.exports = fatorial
// para importar -> const fatorial = require('./fatorial')
//# sourceMappingURL=fatorial.js.map