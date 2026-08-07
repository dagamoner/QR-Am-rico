import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-sans p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg border max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-2">Sistema de Entradas</h1>
        <p className="text-gray-500 mb-8">Gestión y validación de códigos QR</p>
        
        <div className="flex flex-col gap-4">
          <Link 
            href="/admin" 
            className="bg-black text-white py-4 px-6 rounded-lg font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
          >
            Panel de Administración
          </Link>
          
          <Link 
            href="/scan" 
            className="bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            Escáner de Puerta
          </Link>
        </div>
      </div>
    </div>
  );
}
