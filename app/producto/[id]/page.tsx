'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

function fmt(n: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);
}

export default function ProductoPage() {
  const { id } = useParams();
  const [producto, setProducto] = useState<any>(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    fetch(`/api/productos/${id}`).then(r => r.json()).then(setProducto);
  }, [id]);

  function addToCart() {
    const cart = JSON.parse(localStorage.getItem('isolar_cart') || '[]');
    const existing = cart.find((i: any) => i.id === producto.id);
    if (existing) { existing.cantidad += cantidad; }
    else { cart.push({ id: producto.id, nombre: producto.nombre, precio: Number(producto.precio), cantidad, stock: producto.stock }); }
    localStorage.setItem('isolar_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    alert('Producto agregado al carrito');
  }

  if (!producto) return <div className="min-h-screen flex items-center justify-center text-gray-500">Cargando...</div>;

  const specs = typeof producto.specs === 'string' ? JSON.parse(producto.specs) : (producto.specs || {});
  const features = producto.features || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-navy text-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-lg font-montserrat font-bold">iSolar</Link>
          <Link href="/carrito" className="text-sm bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20">Carrito</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="text-navy text-sm hover:underline mb-6 inline-block">&larr; Volver al catalogo</Link>

        <div className="bg-white rounded-xl shadow p-6 md:p-8">
          <div className="mb-2">
            <span className="text-xs text-gray-400 uppercase tracking-wide">{producto.marca}</span>
            {producto.referencia && <span className="text-xs text-gray-400 ml-2">Ref: {producto.referencia}</span>}
          </div>
          <h1 className="text-2xl font-montserrat font-bold text-navy mb-4">{producto.nombre}</h1>

          {producto.precio > 0 && (
            <p className="text-3xl font-bold text-solar mb-6">{fmt(Number(producto.precio))}</p>
          )}

          {Object.keys(specs).length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold text-navy mb-2">Especificaciones</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(specs).map(([k, v]) => (
                  <div key={k} className="flex justify-between bg-gray-50 rounded px-3 py-2 text-sm">
                    <span className="text-gray-600">{k}</span>
                    <span className="font-medium">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {features.length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold text-navy mb-2">Caracteristicas</h2>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {features.map((f: string, i: number) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          )}

          {producto.precio > 0 && producto.stock > 0 && (
            <div className="flex items-center gap-4 mt-6 pt-6 border-t">
              <div className="flex items-center border rounded-lg">
                <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="px-3 py-2 text-lg">-</button>
                <span className="px-3 py-2 min-w-[40px] text-center">{cantidad}</span>
                <button onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))} className="px-3 py-2 text-lg">+</button>
              </div>
              <button onClick={addToCart} className="bg-solar text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-solar-dark transition flex-1 md:flex-none">
                Agregar al carrito
              </button>
              <span className="text-sm text-gray-400">{producto.stock} disponibles</span>
            </div>
          )}

          {producto.stock === 0 && <p className="text-red-600 font-semibold mt-4">Sin stock</p>}

          <a href={`https://wa.me/573001234567?text=Hola, me interesa ${encodeURIComponent(producto.nombre)}`}
            target="_blank" rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-green-600 transition">
            Consultar por WhatsApp
          </a>
        </div>
      </main>
    </div>
  );
}
