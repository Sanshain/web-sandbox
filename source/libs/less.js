//@ts-check

/**
 @typedef {{
    CONTINUE: 100,
    SWITCHING_PROTOCOLS: 101,
    PROCESSING: 102,
    EARLYHINTS: 103,
    OK: 200
  }} IHttpCodes
*/

/**
  @typedef {{
    [K in keyof IHttpCodes as IHttpCodes[K]]: K extends `${infer A}_${infer B}_${infer C}_${infer D}`
      ? `${A} ${B} ${C} ${D}`
      : K extends `${infer A}_${infer B}_${infer C}`
      ? `${A} ${B} ${C}`
      : K extends `${infer A}_${infer B}`
      ? `${A} ${B}`
      : K;
  }} TT

 */

/**
 * @type TT
 */
let t = {
  100: "CONTINUE",
  101: "SWITCHING PROTOCOLS",
  102: "PROCESSING",
  103: "EARLYHINTS",
  200: "OK"
}
