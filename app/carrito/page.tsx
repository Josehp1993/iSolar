'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

function fmt(n: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);
}

export default function CarritoPage() {
  const { items, subtotal, iva, total, updateQty, removeItem, clear } = useCart();
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', cedula: '', ciudad: '', direccion: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function checkout(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    setError('');

    try {
      const clienteRes = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono,
          cedula: form.cedula,
          ciudad: form.ciudad,
          direccion: form.direccion,
        }),
      });
      const cliente = await clienteRes.json();

      const referencia = `ISO-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      const amountInCents = total * 100;

      const pedidoRes = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_id: cliente.id,
          referencia,
          subtotal,
          iva,
          total,
          direccion_envio: `${form.direccion}, ${form.ciudad}`,
          items: items.map(i => ({ producto_id: i.id, cantidad: i.cantidad, precio_unitario: i.precio })),
        }),
      });

      if (!pedidoRes.ok) throw new Error('Error creando pedido');

      const pubKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
      if (pubKey) {
        const hashRes = await fetch('/api/wompi/integrity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference: referencia, amountInCents, currency: 'COP' }),
        });
        const { hash } = await hashRes.json();

        const widgetCheckout = new (window as any).WidgetCheckout({
          currency: 'COP',
          amountInCents,
          reference: referencia,
          publicKey: pubKey,
          integritySignature: hash,
          customerData: {
            email: form.email,
            fullName: form.nombre,
            phoneNumber: form.telefono,
            legalId: form.cedula,
            legalIdType: 'CC',
          },
          redirectUrl: `${window.location.origin}/pedido/confirmacion?ref=${referencia}`,
        });
        widgetCheckout.open((result: any) => {
          if (result.transaction) {
            clear();
            window.location.href = `/pedido/confirmacion?ref=${referencia}`;
          }
        });
      } else {
        clear();
        window.location.href = `/pedido/confirmacion?ref=${referencia}`;
      }
    } catch {
      setError('Error procesando el pedido. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-navy text-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-lg font-montserrat font-bold">iSolar</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="text-navy text-sm hover:underline mb-6 inline-block">&larr; Seguir comprando</Link>
        <h1 className="text-2xl font-montserrat font-bold text-navy mb-6">Carrito de compras</h1>

        {items.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg mb-4">Tu carrito esta vacio</p>
            <Link href="/" className="text-navy font-semibold hover:underline">Ver catalogo</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
              {items.map(item => (
                <div key={item.id} className="bg-white rounded-xl p-4 flex items-center gap-4">
                  {item.imagen_url && (
                    <img src={item.imagen_url} alt={item.nombre} className="w-16 h-16 object-contain rounded bg-gray-50 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-navy truncate">{item.nombre}</p>
                    <p className="text-sm text-gray-500">{fmt(item.precio)} c/u</p>
                    {item.marca && <p className="text-xs text-gray-400">{item.marca}</p>}
                  </div>
                  <div className="flex items-center border rounded-lg">
                    <button onClick={() => updateQty(item.id, item.cantidad - 1)} className="px-2 py-1 hover:bg-gray-100">-</button>
                    <span className="px-2 min-w-[30px] text-center text-sm">{item.cantidad}</span>
                    <button onClick={() => updateQty(item.id, item.cantidad + 1)} className="px-2 py-1 hover:bg-gray-100">+</button>
                  </div>
                  <p className="font-semibold w-28 text-right">{fmt(item.precio * item.cantidad)}</p>
                  <button onClick={() => removeItem(item.id)} className="text-red-500 text-sm hover:underline">Quitar</button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-5">
              <h2 className="font-semibold text-navy mb-4">Resumen</h2>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
                <div className="flex justify-between"><span>IVA (19%)</span><span>{fmt(iva)}</span></div>
                <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span className="text-solar">{fmt(total)}</span></div>
              </div>

              {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

              <form onSubmit={checkout} className="space-y-3">
                <input required placeholder="Nombre completo" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm" />
                <input required placeholder="Cedula" value={form.cedula} onChange={e => setForm({ ...form, cedula: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm" />
                <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm" />
                <input required placeholder="Telefono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm" />
                <input required placeholder="Ciudad" value={form.ciudad} onChange={e => setForm({ ...form, ciudad: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm" />
                <input required placeholder="Direccion de envio" value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm" />
                <button type="submit" disabled={loading}
                  className="w-full bg-solar text-white py-2.5 rounded-lg font-semibold hover:bg-solar-dark disabled:opacity-50 transition">
                  {loading ? 'Procesando...' : 'Pagar con Wompi'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
