'use client'

import * as pdfjsLib from 'pdfjs-dist'
import { useRef, useEffect } from 'react'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
interface Props {
  file: File
  template: {
    width: number
    height: number
    bleed: number
    safeZone: number
  }
}
export function PdfPreview({ file, template }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!file) return

    const render = async () => {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const page = await pdf.getPage(1)

      const viewport = page.getViewport({ scale: 1 })

      const canvas = canvasRef.current!
      const ctx = canvas.getContext('2d')!

      // scale to fit container
      const scale = 0.8
      const scaledViewport = page.getViewport({ scale })

      canvas.width = scaledViewport.width
      canvas.height = scaledViewport.height

      await page.render({
        canvasContext: ctx,
        viewport: scaledViewport,
      }).promise

      // ---- overlay drawing ----

      // convert mm → pt → scale
      const mmToPx = (mm: number) => ((mm * 72) / 25.4) * scale

      const trimW = mmToPx(template.width)
      const trimH = mmToPx(template.height)

      const bleed = mmToPx(template.bleed)
      const safe = mmToPx(template.safeZone)

      // center on page
      const x = (canvas.width - trimW) / 2
      const y = (canvas.height - trimH) / 2

      // 🟢 trim size
      ctx.strokeStyle = 'green'
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, trimW, trimH)

      // 🔴 bleed
      ctx.strokeStyle = 'red'
      ctx.strokeRect(x - bleed, y - bleed, trimW + bleed * 2, trimH + bleed * 2)

      // 🟡 safe zone
      ctx.strokeStyle = 'orange'
      ctx.strokeRect(x + safe, y + safe, trimW - safe * 2, trimH - safe * 2)
    }

    render()
  }, [file, template])

  return <canvas ref={canvasRef} className='border rounded-lg shadow' />
}
