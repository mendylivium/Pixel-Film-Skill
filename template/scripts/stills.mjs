// Renders some frames as JPEGs, to check framing before a long render (WebGL on the CPU is slow).
//   node scripts/stills.mjs [composition] frame frame ...   → out/stills/fNNNN.jpeg (half size)
import { bundle } from '@remotion/bundler'
import { renderStill, selectComposition } from '@remotion/renderer'
import { mkdirSync } from 'node:fs'
import path from 'node:path'

let [id, ...frames] = process.argv.slice(2)
if (/^\d+$/.test(id ?? '')) frames.unshift(id), (id = 'Film')
if (!frames.length) throw Error('usage: node scripts/stills.mjs [composition] frame frame ...')
const out = path.resolve('out/stills')
mkdirSync(out, { recursive: true })
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') })
const chromiumOptions = { gl: 'swangle' }
const composition = await selectComposition({ serveUrl, id, chromiumOptions })
for (const frame of frames.map(Number)) {
  const file = `${out}/f${String(frame).padStart(4, '0')}.jpeg`
  await renderStill({ composition, serveUrl, output: file, imageFormat: 'jpeg', frame, scale: 0.5, chromiumOptions })
  console.log(file)
}
