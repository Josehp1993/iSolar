'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function fmt(n: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);
}

interface CartItem { id: number; nombre: string; precio: number; cantidad: number; stock: number }

export default function CarritoPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', direccion: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('isolar_cart') || '[]');
    setItems(cart);
  }, []);

  function save(updated: CartItem[]) {
    setItems(updated);
    localStorage.setItem('isolar_cart', JSON.stringify(updated));
  }

  function updateQty(id: number, qty: number) {
    save(items.map(i => i.id === id ? { ...i, cantidad: Math.max(1, Math.min(i.stock, qty)) } : i));
  }

  function remove(id: number) {
    save(items.filter(i => i.id !== id));
  }

  const subtotal = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const iva = Math.round(subtotal * 0.19);
  const total = subtotal + iva;

  async function checkout(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);

    try {
      const clienteRes = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: form.nombre, email: form.email, telefono: form.telefono, direccion: form.direccion }),
      });
      const cliente = await clienteRes.json();

      const referencia = `ISO-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

      const pedidoRes = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_id: cliente.id,
          referencia,
          subtotal,
          iva,
          total,
          direccion_envio: form.direccion,
          items: items.map(i => ({ producto_id: i.id, cantidad: i.cantidad, precio_unitario: i.precio })),
        }),
      });

      if (!pedidoRes.ok) throw new Error('Error creando pedido');

      const pubKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
      if (pubKey) {
        const integritySecret = process.env.NEXT_PUBLIC_WOMPI_INTEGRITY_KEY || '';
        const amountInCents = total * 100;
        const checkout = new (window as any).WidgetCheckout({
          currency: 'COP',
          amountInCents,
          reference: referencia,
          publicKey: pubKey,
          redirectUrl: `${window.location.origin}/pedido/confirmacion?ref=${referencia}`,
        });
        checkout.open((result: any) => {
          if (result.transaction) {
            localStorage.removeItem('isolar_cart');
            window.location.href = `/pedido/confirmacion?ref=${referencia}`;
          }
        });
      } else {
        localStorage.removeItem('isolar_cart');
        window.location.href = `/pedido/confirmacion?ref=${referencia}`;
      }
    } catch (err) {
      alert('Error procesando el pedido');
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
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-navy truncate">{item.nombre}</p>
                    <p className="text-sm text-gray-500">{fmt(item.precio)} c/u</p>
                  </div>
                  <div className="flex items-center border rounded-lg">
                    <button onClick={() => updateQty(item.id, item.cantidad - 1)} className="px-2 py-1">-</button>
                    <span className="px-2 min-w-[30px] text-center text-sm">{item.cantidad}</span>
                    <button onClick={() => updateQty(item.id, item.cantidad + 1)} className="px-2 py-1">+</button>
                  </div>
                  <p className="font-semibold w-28 text-right">{fmt(item.precio * item.cantidad)}</p>
                  <button onClick={() => remove(item.id)} className="text-red-500 text-sm hover:underline">Quitar</button>
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

              <form onSubmit={checkout} className="space-y-3">
                <input required placeholder="Nombre completo" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm" />
                <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm" />
                <input required placeholder="Telefono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })}
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

      <script src="https://checkout.wompi.co/widget.js" async />
    </div>
  );
}
