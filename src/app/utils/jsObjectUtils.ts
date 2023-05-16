/**
 * Utility function to get the key from a value in a JS object
 */

export function getKeyByValue(object, value): string {
  let key;
  try {
    key = Object.keys(object).find((key) => object[key] === value);
  } catch (err) {
    key = '';
  }
  return key;
}
