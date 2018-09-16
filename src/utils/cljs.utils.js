/** @module **/

//TODO should account for all sequence data structures, not jsut hashmaps
/**
 * getIn - map
 *
 * @param persistantHashMap
 * @param keyDef
 * @returns {undefined}
 */
export default function getIn(keyDef, persistantHashMap) {
  if (persistantHashMap === undefined) return undefined;
  return (keyDef instanceof Array)
    ? keyDef.reduce((prev, key) =>
      (prev === undefined ? undefined : prev.get(key)), persistantHashMap)
    : persistantHashMap.get(keyDef);
}
