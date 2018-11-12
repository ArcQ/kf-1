import createHelpers from 'utils/reduxHelpers';

const namespace = 'GAME-ENGINE';
const { createConstantsAndActions } = createHelpers(namespace);

const constArr = [
  'PUSH-LOCATION',
  'SET-LOAD-PERCENTAGE',
];

export const { constants, actions } = createConstantsAndActions(constArr);

// export function push(path) {
//   return {
//     type: 'push-location',
//     path,
//   };
// }
