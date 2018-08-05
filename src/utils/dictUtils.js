/**
 * swapKV - for a { k : v }, return { v : k }
 *
 * @param obj
 * @returns {Object}
 */

export function swapKV(obj) {
  return Object.keys(obj).reduce(key => ({ [obj[key]]: key }));
}

export default {};
