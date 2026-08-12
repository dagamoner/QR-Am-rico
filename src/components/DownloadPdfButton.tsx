'use client';

import { Guest } from '@/app/actions';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function DownloadPdfButton({ guests }: { guests: Guest[] }) {
  const downloadPdf = () => {
    const doc = new jsPDF();
    const TICKET_PRICE = 55000;

    const generateTableAndTotals = (startY: number) => {
      const sortedGuests = [...guests].sort((a, b) => a.name.localeCompare(b.name));

      const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        const d = new Date(dateString);
        return d.toLocaleDateString('es-AR', {
          day: '2-digit', month: '2-digit', year: 'numeric'
        });
      };

      // Table Data
      const headers = [['Nombre', 'Celular', 'Generado', 'Pagado el', 'Cant.', 'Estado', 'Debe', 'Pagado']];
      const data = sortedGuests.map(g => {
        const total = g.guests_count * TICKET_PRICE;
        const isPaid = g.payment_status === 'paid';
        const pagado = isPaid ? total : 0;
        const debe = isPaid ? 0 : total;

        return [
          g.name,
          g.phone || '-',
          formatDate(g.created_at),
          formatDate(g.paid_at),
          g.guests_count,
          isPaid ? 'Pagado' : 'Pendiente',
          `$${debe.toLocaleString('es-AR')}`,
          `$${pagado.toLocaleString('es-AR')}`
        ];
      });

      // Draw table
      autoTable(doc, {
        head: headers,
        body: data,
        startY: startY,
        theme: 'striped',
        headStyles: { fillColor: [0, 0, 0] },
        styles: { fontSize: 9 }
      });

      // Calculate totals
      const totalGuests = sortedGuests.reduce((acc, g) => acc + g.guests_count, 0);
      const totalPaidTickets = sortedGuests.filter(g => g.payment_status === 'paid').reduce((acc, g) => acc + g.guests_count, 0);
      const totalFacturado = totalGuests * TICKET_PRICE;
      const totalCobrado = totalPaidTickets * TICKET_PRICE;
      const totalDebe = totalFacturado - totalCobrado;
      
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(11);
      
      // Entradas
      doc.text(`Total Entradas Emitidas: ${totalGuests}`, 14, finalY);
      doc.text(`Total Entradas Pagadas: ${totalPaidTickets}`, 14, finalY + 7);
      doc.text(`Entradas Pendientes: ${totalGuests - totalPaidTickets}`, 14, finalY + 14);

      // Dinero
      doc.text(`Total Emitido: $${totalFacturado.toLocaleString('es-AR')}`, 120, finalY);
      doc.text(`Total Cobrado: $${totalCobrado.toLocaleString('es-AR')}`, 120, finalY + 7);
      doc.text(`Falta Cobrar: $${totalDebe.toLocaleString('es-AR')}`, 120, finalY + 14);

      doc.save('informe_invitados_americo.pdf');
    };

    // Add Logo (from public folder)
    const img = new Image();
    img.src = '/logo.png';
    
    img.onload = () => {
      const imgWidth = 30;
      const imgHeight = (img.height * imgWidth) / img.width;
      const xOffset = (doc.internal.pageSize.width / 2) - (imgWidth / 2);
      
      doc.addImage(img, 'PNG', xOffset, 10, imgWidth, imgHeight);
      doc.setFontSize(16);
      doc.text('Informe de Invitados - Américo Gallardo', doc.internal.pageSize.width / 2, 10 + imgHeight + 10, { align: 'center' });

      generateTableAndTotals(10 + imgHeight + 20);
    };

    img.onerror = () => {
      doc.setFontSize(16);
      doc.text('Informe de Invitados - Américo Gallardo', doc.internal.pageSize.width / 2, 20, { align: 'center' });
      
      generateTableAndTotals(30);
    };
  };

  return (
    <button 
      onClick={downloadPdf}
      className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded font-medium transition"
    >
      Descargar PDF
    </button>
  );
}
