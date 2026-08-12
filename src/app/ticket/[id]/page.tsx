import { getGuestById } from '@/app/actions';
import { notFound } from 'next/navigation';

export default async function TicketPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const guest = await getGuestById(id);

  if (!guest) {
    notFound();
  }

  const calendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=20+Años+Américo+Gallardo&dates=20260926T210000/20260927T040000&details=Celebración+20+Años+Américo+Gallardo.+Elegante+Sport.&location=GARDEN%27S+EVENTOS+Tropero+Sosa+1052%2C+Maip%C3%BA`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans text-gray-200"
         style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}>
      
      <div className="max-w-md w-full bg-[#111] rounded-2xl shadow-2xl overflow-hidden border border-yellow-700/30">
        
        {/* Header / Banner */}
        <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] p-8 text-center border-b border-yellow-700/50">
          <h1 className="text-4xl font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 mb-2 font-serif">
            20 Años
          </h1>
          <p className="text-yellow-500 font-bold tracking-[0.2em] text-sm">AMÉRICO GALLARDO</p>
        </div>

        <div className="p-6">
          <div className="text-center mb-8">
            <h2 className="text-xl italic text-yellow-500/90 mb-4 font-serif">
              "Hay partidos que terminan... pero los grandes equipos permanecen para siempre."
            </h2>
            <p className="text-gray-300 mb-2">
              ¡Los esperamos para celebrar juntos, <strong className="text-yellow-400">{guest.name}</strong>!
            </p>
            
            {guest.payment_status === 'paid' ? (
              <p className="text-green-400 font-bold mt-4 bg-green-900/20 py-2 rounded-lg border border-green-500/30">
                ✅ ¡Tu lugar está confirmado!
              </p>
            ) : (
              <p className="text-yellow-400 font-bold mt-4">
                ⏳ Tu pago está pendiente.
              </p>
            )}
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-5 mb-6 border border-yellow-700/20 text-sm text-gray-300 space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-yellow-500 text-lg">📅</span>
              <div>
                <p className="font-bold text-yellow-500">FECHA Y HORA</p>
                <p>26/09/2026 a las 21:00 hs</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-yellow-500 text-lg">📍</span>
              <div>
                <p className="font-bold text-yellow-500">LUGAR</p>
                <p>GARDEN'S EVENTOS</p>
                <p className="text-xs text-gray-400">Tropero Sosa 1052, Maipú</p>
                <a href="https://share.google/KJAzwYUa3OAtLSnrR" target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:text-yellow-400 font-semibold underline block mt-1 text-xs">
                  Ver en Google Maps
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-yellow-500 text-lg">👔</span>
              <div>
                <p className="font-bold text-yellow-500">DRESS CODE</p>
                <p>Elegante Sport</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-yellow-500 text-lg">🎟️</span>
              <div>
                <p className="font-bold text-yellow-500">ENTRADAS</p>
                <p>{guest.guests_count} persona/s</p>
              </div>
            </div>
          </div>

          {guest.payment_status === 'pending' && (
            <div className="bg-gradient-to-r from-yellow-900/20 to-yellow-900/10 border border-yellow-700/50 rounded-lg p-5 mb-6 text-center">
              <h3 className="font-bold text-yellow-500 mb-3 uppercase tracking-wider text-sm">Datos para el pago</h3>
              <p className="text-gray-300 mb-1">
                Valor por persona: <strong className="text-white">$55.000 ARS</strong>
              </p>
              <p className="text-gray-300 mb-4">
                Total a transferir: <strong className="text-white text-lg">${(55000 * guest.guests_count).toLocaleString('es-AR')} ARS</strong>
              </p>
              
              <div className="bg-[#222] p-3 rounded-lg border border-gray-700 text-lg font-mono font-bold tracking-wider mb-4 text-white cursor-auto select-all shadow-inner">
                Americo.gallardo
              </div>

              <div className="text-sm text-gray-300 mt-4 leading-relaxed bg-black/30 p-3 rounded border border-gray-800">
                <p className="font-bold text-yellow-500 mb-1">⚠️ IMPORTANTE</p>
                <p>Transferí el total a ese Alias y <strong>enviá el comprobante de pago al contacto de Raúl Beyer (2615 33-9837)</strong> para que podamos cargar tu pago y asegurar tu lugar.</p>
                
                <div className="mt-4 border-t border-gray-700/50 pt-3">
                  <p className="text-xs text-gray-400 mb-1">Cuando validemos tu pago te llegará un mensaje a este mismo link:</p>
                  <div className="bg-black/50 p-2 rounded text-xs text-blue-400 break-all select-all border border-gray-700 font-mono">
                    https://qr-am-rico.vercel.app/ticket/{id}
                  </div>
                  <p className="mt-1 text-[10px] text-gray-500 italic uppercase">⚠️ Copiá y guardá este link para poder revisar tu entrada más tarde.</p>
                </div>
              </div>
            </div>
          )}

          {guest.payment_status === 'paid' && (
            <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-5 mb-6 text-center flex flex-col items-center">
               <h3 className="font-bold text-green-400 text-xl mb-2">🎉 ¡Pago Confirmado!</h3>
               <p className="text-gray-200 font-medium">
                 Tu pago ha sido validado correctamente y tus entradas ya están aseguradas.
               </p>
               <p className="text-sm text-gray-400 mt-4 mb-4">
                 El día del evento, simplemente presentate en la puerta y da tu nombre <strong>({guest.name})</strong> para poder ingresar. ¡Te esperamos!
               </p>
               
               <a 
                 href={`https://wa.me/?text=¡Ya tengo mi entrada para los 20 Años de Américo Gallardo!%0A%0A👤 Nombre: ${encodeURIComponent(guest.name)}%0A🎟️ Entradas: ${guest.guest_count}%0A✅ Estado: PAGADO%0A%0AMirá mi ticket acá: https://qr-am-rico.vercel.app/ticket/${guest.id}`}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white py-2 px-4 rounded-lg font-bold transition shadow-lg text-sm"
               >
                 <span>📱 Guardar / Compartir por WhatsApp</span>
               </a>
            </div>
          )}

          <a 
            href={calendarLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-transparent border border-yellow-600 hover:bg-yellow-600/10 text-yellow-500 py-3 rounded-xl font-bold transition"
          >
            🗓️ Agendar en Google Calendar
          </a>

        </div>
      </div>
    </div>
  );
}
