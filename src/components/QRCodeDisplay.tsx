'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

export default function QRCodeDisplay({ text, filename }: { text: string; filename: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    if (canvasRef.current) {
      // Create the absolute URL so standard camera apps open the web page
      const url = `${window.location.origin}/ticket/${text}`;
      QRCode.toCanvas(canvasRef.current, url, { width: 200, margin: 2 }, (error) => {
        if (error) console.error(error);
        if (canvasRef.current) {
          setDataUrl(canvasRef.current.toDataURL('image/png'));
        }
      });
    }
  }, [text]);

  return (
    <div className="flex flex-col items-center gap-2">
      <canvas ref={canvasRef} className="border rounded shadow-sm" />
      {dataUrl && (
        <a
          href={dataUrl}
          download={`QR_${filename.replace(/\s+/g, '_')}.png`}
          className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
        >
          Descargar QR
        </a>
      )}
    </div>
  );
}
