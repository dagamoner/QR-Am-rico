'use client';

import { Guest } from '@/app/actions';

export default function DownloadCsvButton({ guests }: { guests: Guest[] }) {
  const downloadCsv = () => {
    const formatDate = (dateString?: string) => {
      if (!dateString) return '-';
      const d = new Date(dateString);
      return d.toLocaleDateString('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      });
    };

    const headers = ['ID', 'Nombre', 'Estado Pago', 'Uso', 'Cantidad Entradas', 'Fecha Generacion', 'Fecha Pago'];
    const rows = guests.map(g => [
      g.id,
      `"${g.name}"`, // Quote name to avoid issues with commas
      g.payment_status === 'paid' ? 'Pagado' : 'Pendiente',
      g.used_status === 1 ? 'Ya ingresó' : 'No usada',
      g.guests_count,
      `"${formatDate(g.created_at)}"`,
      `"${formatDate(g.paid_at)}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'invitados_fiesta.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button 
      onClick={downloadCsv}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition"
    >
      Descargar Lista (CSV)
    </button>
  );
}
