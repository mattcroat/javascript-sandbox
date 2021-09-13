export function getElement(targetElement: string): HTMLElement {
  const element = document.querySelector(targetElement)

  if (!element) {
    throw new Error(`Element '${targetElement}' doesn't exist.`)
  }

  return element as HTMLElement
}

export function showIframe(): void {
  elements.iframe.style.display = 'block'
  elements.errors.style.display = 'none'
}

export function showError(): void {
  elements.iframe.style.display = 'none'
  elements.errors.style.display = 'block'
}

export const elements = {
  iframe: getElement('[data-iframe]') as HTMLIFrameElement,
  errors: getElement('[data-errors]') as HTMLDivElement,
  editor: getElement('[data-editor]') as HTMLDivElement,
  source: getElement('[data-source]') as HTMLDivElement,
  loading: getElement('[data-loading]') as HTMLDivElement,
}
