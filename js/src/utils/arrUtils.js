export const flatten = list => list.reduce(
  (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), [],
);

export function map2d(arr2d, func) {
  return arr2d.map((row, y) => row.map((val, x) => func(val, x, y)));
}

export default {};
