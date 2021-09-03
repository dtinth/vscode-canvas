const vscode = acquireVsCodeApi()
const workerUrl = document.querySelector('#script').dataset.workerUrl

function showMessage(text) {
  const message = document.createElement('div')
  message.textContent = text
  document.querySelector('#main').appendChild(message)
}

showMessage('Worker URL is ' + workerUrl)

fetch(workerUrl)
  .then((response) => response.text())
  .then((workerCode) => {
    var blob = new Blob([workerCode], { type: 'text/javascript' })
    var worker = new Worker(window.URL.createObjectURL(blob))
    worker.onmessage = function (e) {
      if (e.data.type === 'image') {
        try {
          const canvas = document.createElement('canvas')
          canvas.width = e.data.width
          canvas.height = e.data.height
          const ctx = canvas.getContext('bitmaprenderer')
          ctx.transferFromImageBitmap(e.data.imageBitmap)
          document.querySelector('#main').appendChild(canvas)
        } catch (error) {
          showMessage('Error: ' + error.message)
        }
      }
    }
    worker.onerror = function (e) {
      showMessage(
        'Worker error: ' +
          e.message +
          ' line: ' +
          e.lineno +
          ' col: ' +
          e.colno,
      )
    }
  })
