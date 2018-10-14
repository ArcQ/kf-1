export function push(path) {
  return {
    type: 'push-location',
    path,
  };
}
