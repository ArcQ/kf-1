import { lifecycle } from 'recompose';

export function shouldNeverUpdate(component) {
  return lifecycle({
    shouldComponentUpdate() { return false; },
  })(component);
}

export default {};
