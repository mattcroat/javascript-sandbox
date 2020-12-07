const getEl = (id) => document.getElementById(id)

const iframeEl = getEl('iframe')
const textareaEl = getEl('textarea')

function debounce(callback, delay) {
  let timerId

  return () => {
    clearTimeout(timerId)
    timerId = setTimeout(callback, delay)
  }
}

function setIframeContent() {
  const js = textareaEl.value.trim()

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
          width: 100vw;
          font-family: 'Inter', sans-serif;
          font-size: 1.25rem;
          color: snow;
          padding: 2rem;
        }

        h1, p {
          margin: 1rem 0;
        }
      </style>
    </head>
    <body>
      <div id="app"></div>

      <!-- TODO: change to production -->
      <script src="https://unpkg.com/react@17/umd/react.development.js"><\/script>
      <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"><\/script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
      <script type="text/babel">
        ${js}

        const banana = 'const App = () => <h1>Hello, World!</h1>'
        const output = Babel.transform(input, { presets: ['env', 'react'] }).code
        console.log(output)
      <\/script>
    </body>
    </html>
  `

  iframeEl.srcdoc = source
}

textareaEl.addEventListener('keyup', debounce(setIframeContent, 1000))

setIframeContent()
