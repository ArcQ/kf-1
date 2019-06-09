import swapKV from 'utils/swapKV';

import keyNames from './keyNames.json';

const keyCodes = swapKV(keyNames);

/**
 * keyToCode(keyName: string)
 *
 * @param keyName {string} - The keyName of the key you wish to get the code for.
 *
 * @return {number} - Will be the keycode of the given keyName, or -1 if it does not exist in
 *  the set of known keys.
 */
export function keyToCode(keyName) {
  if (keyNames[keyName]) {
    return keyNames[keyName];
  }
  return -1;
}

/**
 * codeToKey(code: string)
 *
 * @param code {number} - The key code to lookup the keyname for
 *
 * @reaturn {string} - Will be the keyname of the given Code or '' if it does not
 * exist on the set of known codes.
 */
export function codeToKey(code) {
  if (keyCodes[code]) {
    return keyCodes[code];
  }
  return '';
}

export default {};
