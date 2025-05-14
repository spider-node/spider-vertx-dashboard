export function isNil(value) {
  return value === null || value === undefined;
}

export function isEmpty(value) {
  return value === null || value === undefined || value === '';
}
