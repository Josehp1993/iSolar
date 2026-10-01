'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function fmt(n: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);
}

export default function ConfirmacionPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Cargando...</div>}><ConfirmacionContent /></Suspense>;
}

function ConfirmacionContent() {
  const params = useSearchParams();
  const ref = params.get('ref');
  const [pedido, setPedido] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ref) { setLoading(false); return; }
    fetch(`/api/pedidos?ref=${ref}`).then(r => r.json()).then(d => { setPedido(d); setLoading(false); }).catch(() => setLoading(false));
  }, [ref]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Cargando...</div>;

  const estadoLabel: Record<string, { text: string; color: string }> = {
    pendiente: { text: 'Pendiente de pago', color: 'text-yellow-600' },
    aprobado: { text: 'Pago aprobado', color: 'text-green-600' },
    rechazado: { text: 'Pago rechazado', color: 'text-red-600' },
    cancelado: { text: 'Cancelado', color: 'text-red-600' },
  };

  const estado = pedido ? estadoLabel[pedido.estado] || { text: pedido.estado, color: 'text-gray-600' } : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <Link href="/" className="text-lg font-montserrat font-bold">iSolar</Link>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-12">
        {!pedido ? (
          <div className="text-center">
            <p className="text-gray-500 mb-4">Pedido no encontrado</p>
            <Link href="/" className="text-navy font-semibold hover:underline">Volver al catalogo</Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-4xl mb-4">{pedido.estado === 'aprobado' ? '✓' : '⏳'}</div>
            <h1 className="text-xl font-bold text-navy mb-2">
              {pedido.estado === 'aprobado' ? 'Compra exitosa' : 'Pedido registrado'}
            </h1>
            <p className={`font-semibold mb-4 ${estado?.color}`}>{estado?.text}</p>
            <p className="text-sm text-gray-500 mb-6">Referencia: {pedido.referencia}</p>

            <div className="text-left border-t pt-4 space-y-2 text-sm">
              {pedido.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.producto_nombre} x{item.cantidad}</span>
                  <span>{fmt(Number(item.subtotal))}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between"><span>Subtotal</span><span>{fmt(Number(pedido.subtotal))}</span></div>
              <div className="flex justify-between"><span>IVA</span><span>{fmt(Number(pedido.iva))}</span></div>
              <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-solar">{fmt(Number(pedido.total))}</span></div>
            </div>

            <Link href="/" className="inline-block mt-6 bg-navy text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-navy-dark">
              Volver al catalogo
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
