import * as monaco from 'https://cdn.skypack.dev/monaco-editor'

// before loading the editor, define a global MonacoEnvironment that overwrites
// the default worker url location. HTML5 does not allow cross-domain web workers,
// so we need to proxy the instantiation of a web worker through a same-domain script.
window.MonacoEnvironment = {
  getWorkerUrl: () => {
    return `
      data:text/javascript;charset=utf-8,
      ${encodeURIComponent(`
        self.MonacoEnvironment = {
          baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min'
        };
        importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs/base/worker/workerMain.min.js');
      `)}
    `
  },
}

const placeholder = `import confetti from 'https://cdn.skypack.dev/canvas-confetti'

function App() {
  return (
    <div className="app">
      <h1>JavaScript Sandbox</h1>
      <p>
        You can use NPM packages provided by <a href="https://www.skypack.dev/">Skypack</a>.
      </p>
      <img onClick={confetti} src="./image.gif" />
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)`

const options = {
  value: placeholder,
  language: 'javascript',
  theme: 'vs-dark',
  automaticLayout: true,
  minimap: {
    enabled: false,
  },
  fontFamily: 'IBM Plex Mono, monospace',
  fontSize: '20px',
  tabSize: 2,
}

export const editor = monaco.editor.create(
  document.getElementById('editor'),
  options
)
