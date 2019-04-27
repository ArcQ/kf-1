import { createCharFactory } from 'utils/pixi.utils';

const charFactory = {
  goblin: createCharFactory({ spriteSheetArgs: ['chars', 'knights0', '_IDLE/_IDLE'] }),
  assasin: createCharFactory({ spriteSheetArgs: ['chars', 'assasins0', '1_IDLE'] }),
};

/**
 * createCharacters
 *
 * @param config {Object} object with character keys and position as and attribute
 * @returns {Object} character object
 */
export default function createCharacters(config) {
  return Object.entries(config).reduce((acc, [k, v]) =>
    ({
      ...acc,
      [k]: charFactory[k](v),
    }), {});
}
