'use client';

import { Guest } from '@/app/actions';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function DownloadPdfButton({ guests }: { guests: Guest[] }) {
  const downloadPdf = () => {
    const doc = new jsPDF();
    const TICKET_PRICE = 55000;
    const KID_PRICE = 30000;

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
      const headers = [['Nombre', 'Celular', 'Generado', 'Pagado el', 'May.', 'Men.', 'Estado', 'Debe', 'Pagado']];
      const data = sortedGuests.map(g => {
        const total = (g.guests_count * TICKET_PRICE) + (g.kids_count * KID_PRICE);
        const isPaid = g.payment_status === 'paid';
        const pagado = isPaid ? total : 0;
        const debe = isPaid ? 0 : total;

        return [
          g.name,
          g.phone || '-',
          formatDate(g.created_at),
          formatDate(g.paid_at),
          g.guests_count,
          g.kids_count,
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
      const totalMayores = sortedGuests.reduce((sum, g) => sum + g.guests_count, 0);
      const totalMenores = sortedGuests.reduce((sum, g) => sum + g.kids_count, 0);
      const totalIngresos = sortedGuests.reduce((sum, g) => {
        return sum + (g.payment_status === 'paid' ? (g.guests_count * TICKET_PRICE) + (g.kids_count * KID_PRICE) : 0);
      }, 0);
      const totalDeuda = sortedGuests.reduce((sum, g) => {
        return sum + (g.payment_status === 'pending' ? (g.guests_count * TICKET_PRICE) + (g.kids_count * KID_PRICE) : 0);
      }, 0);
      
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(11);
      
      // Entradas
      doc.text(`Total Entradas: ${totalMayores} Mayores, ${totalMenores} Menores`, 14, finalY);
      doc.text(`Total Pagadas: ${sortedGuests.filter(g => g.payment_status === 'paid').reduce((sum, g) => sum + g.guests_count + g.kids_count, 0)}`, 14, finalY + 7);
      doc.text(`Entradas Pendientes: ${sortedGuests.filter(g => g.payment_status === 'pending').reduce((sum, g) => sum + g.guests_count + g.kids_count, 0)}`, 14, finalY + 14);

      // Dinero
      doc.text(`Total Emitido: $${(totalIngresos + totalDeuda).toLocaleString('es-AR')}`, 120, finalY);
      doc.text(`Total Cobrado: $${totalIngresos.toLocaleString('es-AR')}`, 120, finalY + 7);
      doc.text(`Falta Cobrar: $${totalDeuda.toLocaleString('es-AR')}`, 120, finalY + 14);

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
