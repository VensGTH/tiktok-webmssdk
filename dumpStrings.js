const zlib = require("zlib");

const decompress = (data) => zlib.inflateRawSync(Buffer.from(data));

function leb128Decode(e) {
  for (var t = 0, r = 0; ; ) {
    var n = e["d"][e["i"]++];
    if (((t |= (127 & n) << r), (r += 7), 0 == (128 & n)))
      return r < 32 && 0 != (64 & n) ? t | (-1 << r) : t;
  }
}

function utf8Decode(e) {
  for (var t = -1, r = new Array(); ; ) {
    var n = e["d"][e["i"]++];
    if (n >= 128 && n < 192) t = (t << 6) + (63 & n);
    else if ((t >= 0 && r.push(t), n < 128)) t = n;
    else if (n < 224) t = 31 & n;
    else if (n < 240) t = 15 & n;
    else {
      if (!(n < 248)) break;
      t = 7 & n;
    }
  }
  return String.fromCodePoint.apply(null, r);
}

function extractStrings(dictionary) {
  const deflated = decompress(dictionary.buffer);

  const cpoint = new Uint8Array([...deflated]);

  const data = { d: cpoint, i: 0 };
  const length = leb128Decode(data);

  let result = [];
  for (let n = length, o = 0; o < n; ++o) result.push(utf8Decode(data));

  return result;
}

module.exports = extractStrings;
