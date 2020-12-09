export function getEl(id) {
  return document.getElementById(id)
}

export function createEl(tag, content) {
  if (content) {
    const domEl = document.createElement(tag)
    domEl.innerText = content

    return domEl
  }

  return document.createElement(tag)
}

export function debounce(callback, delay) {
  let timerId

  return () => {
    clearTimeout(timerId)
    timerId = setTimeout(callback, delay)
  }
}
