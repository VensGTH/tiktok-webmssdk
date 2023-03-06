class Webmssdk {

  private MAGIC1 = 1213091658;
  private MAGIC2 = 1077891651;

  genCode(code: string, r: number): number[] {
    var t = parseInt(code.slice(r, r + 2), 16);
    if (t >>> 7 == 0) {
      return [1, t]
    } else if (t >>> 6 == 2) {
      t = (63 & t) << 8;
      return [2, t += parseInt(code.slice(r + 2, r + 4), 16)]
    } else {
      t = (63 & t) << 16;
      return [3, t += parseInt(code.slice(r + 2, r + 6), 16)]
    }
  }

  genKey(str: string) {
    let key = 0;
    for (let n = 0; n < 4; ++n) {
      key += (3 & parseInt(str.slice(24 + 2 * n, 26 + 2 * n), 16)) << 2 * n;
    }
    //console.log("key", key);
    return key;
  }

  decodeStr(str: string, u: number, b: number, key: number) {
    const data: string[] = [];
    for (let n = 0; n < b; ++n) {
      var p = this.genCode(str, u);
      //console.log(p);
      u += 2 * p[0];
      let h = "";
      for (let chrIndex = 0; chrIndex < p[1]; ++chrIndex) {
        var x = this.genCode(str, u);
        h += String.fromCharCode(key ^ x[1]), u += 2 * x[0];
      }
      data.push(h);
    }
    //console.log(i);
    return data;
  }

  chkMagic(m_1: number, m_2: number) {
    if (this.MAGIC1 !== m_1 || this.MAGIC2 !== m_2) {
      throw new Error("Magic error...");
    }
  }

  validateStr(str: string) {
    if (0 !== parseInt(str.slice(16, 18), 16)) {
      throw new Error("Invalid string");
    }
  }

  decrypt(str: string) {
    const m_1 = parseInt(str.slice(0, 8), 16);
    const m_2 = parseInt(str.slice(8, 16), 16);

    this.chkMagic(m_1, m_2);
    this.validateStr(str);

    const key = this.genKey(str);
    var l = 2 * parseInt(str.slice(48, 56), 16);
    var u = l + 56, b = parseInt(str.slice(u, u + 4), 16);
    const strARR = this.decodeStr(str, u + 4, b, key);
    return strARR;
  }

}

const webmssdk = new Webmssdk();

export default webmssdk;