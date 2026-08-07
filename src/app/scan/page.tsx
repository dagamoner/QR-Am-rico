'use client';

import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { verifyGuestAndMarkUsed, type Guest } from '@/app/actions';

type ScanResult = {
  success: boolean;
  message: string;
  guest?: Guest;
};

export default function ScanPage() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanning, setScanning] = useState(true);

  const handleScan = async (text: string) => {
    if (!scanning) return;
    setScanning(false); // Pause scanning while verifying
    
    // Extract ID if the QR contains a full URL
    let ticketId = text;
    try {
      const url = new URL(text);
      const parts = url.pathname.split('/');
      ticketId = parts[parts.length - 1]; // Get the last part of the path (the ID)
    } catch (e) {
      // Not a valid URL, maybe it's just the plain ID (for backward compatibility)
    }

    try {
      const res = await verifyGuestAndMarkUsed(ticketId);
      setResult(res);
    } catch (error) {
      setResult({ success: false, message: 'Error de red o servidor' });
    }
  };

  const resetScanner = () => {
    setResult(null);
    setScanning(true);
  };

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col items-center justify-center min-h-screen font-sans bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-center">Escáner de Entradas</h1>

      {!result ? (
        <div className="w-full bg-white p-4 rounded-xl shadow-lg border">
          <div className="aspect-square w-full rounded overflow-hidden relative">
            <Scanner
              onScan={(result) => {
                if (result && result.length > 0) {
                    handleScan(result[0].rawValue);
                }
              }}
              formats={['qr_code']}
            />
          </div>
          <p className="text-center text-gray-500 mt-4 text-sm">Apunta la cámara al código QR de la tarjeta</p>
        </div>
      ) : (
        <div className={`w-full p-8 rounded-xl shadow-lg border text-center flex flex-col items-center gap-4 ${
          result.success ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'
        }`}>
          {result.success ? (
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
             <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}

          <h2 className={`text-2xl font-bold ${result.success ? 'text-green-800' : 'text-red-800'}`}>
            {result.message}
          </h2>
          
          {result.guest && (
            <div className="bg-white/50 p-4 rounded w-full text-left mt-2 border border-black/10">
              <p><strong>Nombre:</strong> {result.guest.name}</p>
              <p><strong>ID:</strong> {result.guest.id}</p>
              <p><strong>Pago:</strong> {result.guest.payment_status === 'paid' ? 'Pagado' : 'Pendiente'}</p>
            </div>
          )}

          <button 
            onClick={resetScanner}
            className="mt-4 bg-gray-800 hover:bg-black text-white px-8 py-3 rounded-full font-bold w-full transition"
          >
            Escanear otra entrada
          </button>
        </div>
      )}
    </div>
  );
}
