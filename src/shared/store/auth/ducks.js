// // vendor
// import createHelpers from 'utils/reduxHelpers';
// import { fromJS } from 'immutable';
//
// const namespace = 'app/auth';
// const { createConstantsAndActions } = createHelpers(namespace);
//
// const constArr = [
//   'LOGIN',
//   'REGISTER',
//   'LOGOUT',
//   'SET_PROFILE',
//   'CHECK_SESSION',
//   'CHANGE_AUTH_SUCCESS',
//   'SESSION_CHECKED',
//   'SAVE_EDIT_PROFILE',
// ];
//
// #<{(|
//  * Constants and Actions
//  |)}>#
//
// export const { constants, actions } = createConstantsAndActions(constArr);
//
// #<{(|
//  * Selectors
//  |)}>#
//
// export const selectors = {
//   auth: state => state.get('auth').toJS(),
//   myProfile: state => state.getIn(['auth', 'profile']),
//   currentUsername: state => state.getIn(['auth', 'profile', 'username']),
//   isOwn: state => user => (
//     user && ((state.getIn(['auth', 'profile', 'username']) === user.username)
//     || (state.getIn(['auth', 'profile', '_id']) === user._id))
//   ),
//   firstName: (state) => {
//     const name = state.getIn(['auth', 'profile', 'name']);
//     if (!name) return '';
//     return name.split(' ')[0];
//   },
//   loggedIn: state => state.getIn(['auth', 'loggedIn']),
//   isFacebookAccount: state => state.getIn(['auth', 'facebookAccount']),
//   avatar: state => state.getIn(['auth', 'avatar']),
//   hasCheckedSession: state => state.getIn(['auth', 'hasCheckedSession']),
//   isProfileVerified: (state) => {
//     const profileVerified = state.getIn(['auth', 'profile', 'verified']);
//     return ((profileVerified) && ((profileVerified.get('email') && profileVerified.get('emailConfirmed'))
//       || profileVerified.get('digits') || profileVerified.get('facebook') || profileVerified.get('google')));
//   },
// };
//
// #<{(|
//  * Reducer
//  |)}>#
//
// // The initial application state
// const initialState = fromJS({
//   hasCheckedSession: false,
//   loggedIn: false,
//   profile: {},
//   avatar: '',
//   facebookAccount: false,
//   newAccount: false,
// });
//
// const c = constants;
//
// // Takes care of changing the application state
// export default function authReducer(state = initialState, action) {
//   switch (action.type) {
//     case c.LOGOUT:
//       return initialState
//         .setIn(['hasCheckedSession'], true);
//     case c.SET_PROFILE:
//       return state
//         .setIn(['profile'], fromJS(action.payload.profile))
//         .setIn(['facebookAccount'], action.payload.profile.verified ? action.payload.profile.verified.facebook : false)
//         .setIn(['avatar'], action.payload.profile.avatar.url)
//         .setIn(['hasCheckedSession'], true)
//         .setIn(['isNewAccount'], action.payload.isNewAccount)
//         .setIn(['location'], action.payload.profile.location)
//         .setIn(['loggedIn'], true);
//     case c.SESSION_CHECKED:
//       return state
//         .setIn(['hasCheckedSession'], true);
//     case c.SAVE_EDIT_PROFILE:
//       return Object.keys(action.payload).reduce((stateObj, attr) => stateObj
//         .setIn(['profile', attr], fromJS(action.payload[attr])), state);
//     case c.LOGIN:
//     case c.REGISTER:
//     case c.REGISTER_SUCCESS:
//     case c.CHECK_SESSION:
//     default:
//       return state;
//   }
// }
