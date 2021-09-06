export function getElement(element: string) {
  return document.querySelector(element)
}

export function showIframe() {
  elements.iframe.style.display = 'block'
  elements.errors.style.display = 'none'
}

export function showError() {
  elements.iframe.style.display = 'none'
  elements.errors.style.display = 'block'
}

export const elements = {
  iframe: getElement('[data-iframe]') as HTMLIFrameElement,
  errors: getElement('[data-errors]') as HTMLDivElement,
  editor: getElement('[data-editor]') as HTMLDivElement,
  source: getElement('[data-source]') as HTMLDivElement,
}
