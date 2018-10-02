/** @module **/

import battleGround from 'battleground/out/battle.core';

const { jsutils } = battleGround;

//TODO should account for all sequence data structures, not jsut hashmaps
/**
 * getIn - map
 *
 * @param persistantHashMap
 * @param keyDef
 * @returns {undefined}
 */
export const getIn = jsutils.getIn;
