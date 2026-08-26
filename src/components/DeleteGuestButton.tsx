'use client';

import { deleteGuest } from '@/app/actions';
import { useState } from 'react';

export default function DeleteGuestButton({ id, name }: { id: string, name: string }) {
  const [loading, setLoading] = useState(false);
  return (
    <button
      onClick={async () => {
        if (window.confirm(`⚠️ ADVERTENCIA\n\n¿Estás TOTALMENTE SEGURO de eliminar a ${name} de la lista de invitados?\n\nEsta acción borrará sus datos para siempre y no se puede deshacer.`)) {
          setLoading(true);
          await deleteGuest(id);
        }
      }}
      disabled={loading}
      className="w-full bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded font-medium text-sm transition disabled:opacity-50"
    >
      {loading ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
}
