export function getEl(id) {
  return document.getElementById(id)
}

export function debounce(callback, delay) {
  let timerId

  return () => {
    clearTimeout(timerId)
    timerId = setTimeout(callback, delay)
  }
}
