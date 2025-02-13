const dictionary = require("./decryptBytecode.js");
const extractStrings = require("./dumpStrings.js");

(() => {
  try {
    const result = extractStrings(dictionary);
    console.dir(result, { maxArrayLength: null });
  } catch (err) {
    console.log("Error encountered while trying to decrypt the bytecode");
  }
})();
