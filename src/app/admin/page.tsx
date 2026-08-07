import { getGuests, addGuest, markAsPaid, deleteGuest } from '@/app/actions';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import DownloadCsvButton from '@/components/DownloadCsvButton';

export default async function AdminPage() {
  const guests = await getGuests();

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-8">Administración de Entradas</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-8 border">
        <h2 className="text-xl font-semibold mb-4">Agregar Invitado</h2>
        <form action={async (formData) => {
          'use server';
          const name = formData.get('name') as string;
          const count = parseInt(formData.get('count') as string) || 1;
          if (name) await addGuest(name, count);
        }} className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            name="name"
            placeholder="Nombre completo"
            required
            className="border p-2 rounded flex-1"
          />
          <input
            type="number"
            name="count"
            defaultValue="1"
            min="1"
            placeholder="Cant. Entradas"
            className="border p-2 rounded w-32"
          />
          <button type="submit" className="bg-black text-white px-6 py-2 rounded font-medium hover:bg-gray-800 transition">
            Agregar
          </button>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6 border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Lista de Invitados ({guests.length})</h2>
          <DownloadCsvButton guests={guests} />
        </div>
        
        <div className="space-y-6">
          {guests.map((guest) => (
            <div key={guest.id} className="flex flex-col md:flex-row justify-between items-center p-4 border rounded bg-gray-50 gap-4">
              <div className="flex-1">
                <p className="font-bold text-lg">{guest.name}</p>
                <p className="text-sm text-gray-500">ID: {guest.id} • Entradas: {guest.guests_count}</p>
                <p className="mt-2">
                  Pago: 
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${guest.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {guest.payment_status === 'paid' ? 'PAGADO' : 'PENDIENTE'}
                  </span>
                </p>
                <p className="mt-1">
                  Uso: 
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${guest.used_status === 1 ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-800'}`}>
                    {guest.used_status === 1 ? 'YA INGRESÓ' : 'NO USADA'}
                  </span>
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {guest.payment_status === 'pending' && (
                  <form action={async () => {
                    'use server';
                    await markAsPaid(guest.id);
                  }}>
                    <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-medium text-sm transition">
                      Marcar Pagado
                    </button>
                  </form>
                )}
                
                <form action={async () => {
                  'use server';
                  await deleteGuest(guest.id);
                }}>
                  <button type="submit" className="w-full bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded font-medium text-sm transition">
                    Eliminar
                  </button>
                </form>
              </div>

              <div className="hidden md:block w-px h-24 bg-gray-300 mx-4"></div>

              <div className="flex-shrink-0">
                <QRCodeDisplay text={guest.id} filename={guest.name} />
              </div>
            </div>
          ))}
          {guests.length === 0 && (
            <p className="text-gray-500 text-center py-4">No hay invitados registrados todavía.</p>
          )}
        </div>
      </div>
    </div>
  );
}
