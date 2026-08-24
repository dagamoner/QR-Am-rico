import { addGuest } from '@/app/actions';
import { redirect } from 'next/navigation';

export default function Home() {
  const calendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=20+Años+Américo+Gallardo&dates=20260926T210000/20260927T040000&details=Celebración+20+Años+Américo+Gallardo.+Elegante+Sport.&location=GARDEN%27S+EVENTOS+Tropero+Sosa+1052%2C+Maip%C3%BA`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 font-sans text-gray-200"
         style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}>
      
      <div className="max-w-md w-full bg-[#111] rounded-2xl shadow-2xl overflow-hidden border border-yellow-700/30 flex flex-col">
        
        {/* Header / Banner */}
        <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] p-8 text-center border-b border-yellow-700/50 flex-shrink-0 flex flex-col items-center">
          <img src="/logo.png" alt="Escudo Américo Gallardo" className="w-40 h-auto mb-4 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]" />
          <h1 className="text-4xl font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 mb-2 font-serif">
            20 Años
          </h1>
          <p className="text-yellow-500 font-bold tracking-[0.2em] text-sm">AMÉRICO GALLARDO</p>
        </div>

        <div className="p-6 flex-grow flex flex-col">
          <div className="text-center mb-8">
            <h2 className="text-xl italic text-yellow-500/90 mb-4 font-serif">
              "Hay partidos que terminan... pero los grandes equipos permanecen para siempre."
            </h2>
            <p className="text-gray-300">
              Estás invitado a celebrar junto a nosotros una noche inolvidable.
            </p>
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
              <span className="text-yellow-500 text-lg">💰</span>
              <div>
                <p className="font-bold text-yellow-500">VALOR DE ENTRADA</p>
                <p>$55.000 ARS por persona</p>
              </div>
            </div>
          </div>

          <a 
            href={calendarLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-transparent border border-yellow-600 hover:bg-yellow-600/10 text-yellow-500 py-3 rounded-xl font-bold transition mb-6"
          >
            🗓️ Agendar en Google Calendar
          </a>

          <div className="mt-auto border-t border-yellow-700/30 pt-6">
            <h3 className="text-center font-bold text-yellow-500 mb-4 uppercase tracking-wider text-sm">Reservá tu lugar</h3>
            
            <form action={async (formData) => {
              'use server';
              const name = formData.get('name') as string;
              const count = parseInt(formData.get('count') as string) || 1;
              const kids = parseInt(formData.get('kids') as string) || 0;
              const phone = formData.get('phone') as string || '';
              if (name && phone) {
                const id = await addGuest(name, count, phone, kids);
                if (id) {
                  redirect(`/ticket/${id}`);
                }
              }
            }} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ej: Juan Pérez"
                  required
                  className="w-full bg-[#222] border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:border-yellow-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Número de Celular (WhatsApp)</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Ej: 2611234567"
                  required
                  className="w-full bg-[#222] border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:border-yellow-500 transition"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Entradas Mayores</label>
                  <select 
                    name="count"
                    className="w-full bg-[#222] border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:border-yellow-500 transition"
                    defaultValue="1"
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Entradas Menores</label>
                  <select 
                    name="kids"
                    className="w-full bg-[#222] border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:border-yellow-500 transition"
                    defaultValue="0"
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button type="submit" className="w-full bg-gradient-to-r from-yellow-700 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500 text-white py-3 rounded-lg font-bold transition shadow-lg mt-2">
                Generar mi Entrada
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
