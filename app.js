import { debounce, getEl } from './utility.js'

const textareaEl = getEl('textarea')
const iframeEl = getEl('iframe')
const transpiledEl = getEl('transpiled')
const errorsEl = getEl('errors')

let code = textareaEl.value.trim()

function updateCode() {
  code = textareaEl.value.trim()
}

function transpileCode(code) {
  const options = { presets: ['react'] }
  const { code: babelCode } = Babel.transform(code, options)

  const transpiledCode = babelCode.replace(/\/\*#__PURE__\*\//g, '')

  transpiledEl.innerHTML = `
    <h2>JSX Output</h2>
    <pre>${transpiledCode}</pre>
  `
}

function logErrors() {
  errorsEl.innerHTML = `
    <h2>Error Output</h2>
    <pre>${e.message}</pre>
  `
}

function setIframeContent(iframe, { code }) {
  updateCode()
  transpileCode(code)

  const source = `
    <html>
    <head>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
          font-size: 1.25rem;
          padding: 2rem;
          color: snow;
        }

        h1, h2, p {
          margin: 1rem 0;
        }
      </style>
    </head>
    <body>
      <div id="app"></div>

      <script src="https://unpkg.com/react@17/umd/react.development.js"><\/script>
      <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"><\/script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
      <script type="text/babel">
        ${code}
      <\/script>
    </body>
    </html>
  `

  iframe.srcdoc = source
}

document.body.addEventListener('keyup', () => {
  debounce(setIframeContent(iframeEl, { code }), 1000)
})

setIframeContent(iframeEl, { code })
