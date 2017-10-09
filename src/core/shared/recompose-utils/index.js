import { lifecycle } from 'recompose';

export function neverUpdate(component) {
  return lifecycle({
    shouldComponentUpdate() { return false; },
  })(component);
}

export default {};
