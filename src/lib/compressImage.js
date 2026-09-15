const MAX_WIDTH = 1600
const QUALITY = 0.8

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
}

export async function compressImage(file) {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  const scale = Math.min(1, MAX_WIDTH / bitmap.width)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  let blob = await canvasToBlob(canvas, 'image/webp', QUALITY)
  // Browsers that can't encode WebP silently return PNG, which would defeat the purpose.
  if (!blob || blob.type !== 'image/webp') blob = await canvasToBlob(canvas, 'image/jpeg', 0.85)

  if (blob.size >= file.size && /^image\/(webp|jpeg)$/.test(file.type)) return file

  const ext = blob.type === 'image/webp' ? 'webp' : 'jpg'
  return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.' + ext, { type: blob.type })
}
