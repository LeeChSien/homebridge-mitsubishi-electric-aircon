/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-expressions */
export const calcFCC = (t: string) => {
  for (var e, n, i = 0, o = 0; o < 20; o++) {
    e = t.substring(2 * o, (2 * o) + 2), i += parseInt(e, 16);
  }
  return 1 === (n = (i = 256 - (i %= 256)).toString(16)).length && (n = "0" + n), n.slice(-2)
}
