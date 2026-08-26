'use client';

import { markAsPaid } from '@/app/actions';
import { useState } from 'react';

export default function WhatsAppNotifyButton({ 
  id, 
  name, 
  phone,
  ticketUrl
}: { 
  id: string, 
  name: string, 
  phone: string,
  ticketUrl: string 
}) {
  const [loading, setLoading] = useState(false);

  const handleNotify = async () => {
    if (!window.confirm(`¿Estás seguro de que deseas APROBAR el pago de ${name} y enviarle su entrada por WhatsApp?`)) {
      return;
    }

    setLoading(true);
    // 1. Marca como pagado en la base de datos (Server Action)
    await markAsPaid(id);
    
    // 2. Genera el mensaje de WhatsApp
    const message = `¡Hola ${name}! Tu pago para los 20 Años de Américo Gallardo fue confirmado. ✅\n\nAcá tenés tu entrada oficial:\n${ticketUrl}`;
    const encodedMessage = encodeURIComponent(message);
    
    // 3. Limpia el teléfono (solo números)
    const cleanPhone = phone ? phone.replace(/[\s\-\+]/g, '') : '';
    
    // Si tiene número se lo envía a ese número, si no, abre el selector de contactos
    const waUrl = cleanPhone 
      ? `https://wa.me/${cleanPhone}?text=${encodedMessage}`
      : `https://wa.me/?text=${encodedMessage}`;
      
    // 4. Abre WhatsApp en una pestaña nueva
    window.open(waUrl, '_blank');
    setLoading(false);
  };

  return (
    <button 
      onClick={handleNotify} 
      disabled={loading}
      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm w-full font-bold shadow transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
    >
      {loading ? 'Aprobando...' : (
        <>
          <span>💬</span> Aprobar y Enviar Ticket
        </>
      )}
    </button>
  );
}
