const bytecode = require("./bytecode.js");

const decoded = atob(bytecode);

const keySum = [...decoded.slice(4, 8)].reduce(
  (sum, c) => sum + c.charCodeAt(0),
  0
);

function xorDecrypt(char, index) {
  const baseKey = this.valueOf();
  const modifier = (baseKey % 10) * index;
  return char.charCodeAt(0) ^ (baseKey + modifier) % 256;
}

const dico = Uint8Array.from(decoded.slice(8), xorDecrypt.bind(keySum % 256));

module.exports = dico;
