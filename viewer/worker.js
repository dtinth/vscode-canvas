// Create an OffscreenCanvas
const canvas = new OffscreenCanvas(256, 256)

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d')
ctx.fillStyle = '#FF0000'
ctx.fillRect(0, 0, 256, 256)
ctx.fillStyle = '#00FF00'

ctx.font = '48px serif'
ctx.fillText('Hello World', 10, 50)

// Send as ImageBitmap
self.postMessage({
  type: 'image',
  imageBitmap: canvas.transferToImageBitmap(),
  width: canvas.width,
  height: canvas.height,
})
