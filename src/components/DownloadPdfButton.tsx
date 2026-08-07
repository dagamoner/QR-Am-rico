'use client';

import { Guest } from '@/app/actions';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function DownloadPdfButton({ guests }: { guests: Guest[] }) {
  const downloadPdf = () => {
    const doc = new jsPDF();

    // Add Logo (from public folder)
    const img = new Image();
    img.src = '/logo.png';
    
    img.onload = () => {
      // Calculate image dimensions (center it)
      const imgWidth = 30;
      const imgHeight = (img.height * imgWidth) / img.width;
      const xOffset = (doc.internal.pageSize.width / 2) - (imgWidth / 2);
      
      doc.addImage(img, 'PNG', xOffset, 10, imgWidth, imgHeight);

      // Title
      doc.setFontSize(16);
      doc.text('Lista de Invitados - Américo Gallardo', doc.internal.pageSize.width / 2, 10 + imgHeight + 10, { align: 'center' });

      // Sort guests alphabetically by name
      const sortedGuests = [...guests].sort((a, b) => a.name.localeCompare(b.name));

      // Table Data
      const headers = [['Nombre', 'Cantidad', 'Estado Pago', 'Uso']];
      const data = sortedGuests.map(g => [
        g.name,
        g.guests_count,
        g.payment_status === 'paid' ? 'Pagado' : 'Pendiente',
        g.used_status === 1 ? 'Ya ingresó' : 'No usada'
      ]);

      // Draw table
      autoTable(doc, {
        head: headers,
        body: data,
        startY: 10 + imgHeight + 20,
        theme: 'striped',
        headStyles: { fillColor: [0, 0, 0] }, // Black header
        styles: { fontSize: 10 }
      });

      // Total count
      const totalGuests = sortedGuests.reduce((acc, g) => acc + g.guests_count, 0);
      const totalPaid = sortedGuests.filter(g => g.payment_status === 'paid').reduce((acc, g) => acc + g.guests_count, 0);
      
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.text(`Total Entradas: ${totalGuests}`, 14, finalY);
      doc.text(`Total Entradas Pagadas: ${totalPaid}`, 14, finalY + 7);

      doc.save('invitados_americo.pdf');
    };

    // If image fails to load (e.g. adblocker), just draw table without it
    img.onerror = () => {
      doc.setFontSize(16);
      doc.text('Lista de Invitados - Américo Gallardo', doc.internal.pageSize.width / 2, 20, { align: 'center' });
      
      const sortedGuests = [...guests].sort((a, b) => a.name.localeCompare(b.name));
      const headers = [['Nombre', 'Cantidad', 'Estado Pago', 'Uso']];
      const data = sortedGuests.map(g => [
        g.name,
        g.guests_count,
        g.payment_status === 'paid' ? 'Pagado' : 'Pendiente',
        g.used_status === 1 ? 'Ya ingresó' : 'No usada'
      ]);

      autoTable(doc, {
        head: headers,
        body: data,
        startY: 30,
        theme: 'striped',
        headStyles: { fillColor: [0, 0, 0] },
      });

      doc.save('invitados_americo.pdf');
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
