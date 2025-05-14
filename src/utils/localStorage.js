export function localStorageSet(key, value) {
 localStorage.setItem(key, JSON.stringify(value))
}

export function localStorageGet(key) {
 try {
  return JSON.parse(localStorage.getItem(key))
 } catch (e) {
  return null
 }
}

export function localStorageRemove(key) {
 localStorage.removeItem(key)
}
