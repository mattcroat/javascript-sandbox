export function debounce(callback: () => void, delay = 500): () => void {
  let timerId: NodeJS.Timeout

  return () => {
    clearTimeout(timerId)
    timerId = setTimeout(callback, delay)
  }
}
