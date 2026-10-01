'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Producto {
  id: number;
  nombre: string;
  marca: string;
  referencia: string;
  precio: number;
  precio_oferta: number | null;
  imagen_url: string;
  categoria_nombre: string;
  categoria_slug: string;
  specs: Record<string, string>;
}

interface Categoria {
  id: number;
  nombre: string;
  slug: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  paneles: '☀️',
  inversores: '⚡',
  controladores: '🔌',
  'baterias-gel': '🔋',
  'baterias-litio': '🔋',
  protecciones: '🛡️',
  estructura: '🏗️',
  accesorios: '🔧',
};

function formatPrice(n: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);
}

export default function HomePage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [catActiva, setCatActiva] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('/api/categorias').then(r => r.json()).then(setCategorias).catch(() => {});
    cargarProductos('');
  }, []);

  async function cargarProductos(cat: string) {
    setCargando(true);
    const url = cat ? `/api/productos?categoria=${cat}` : '/api/productos';
    const res = await fetch(url);
    const data = await res.json();
    setProductos(data);
    setCargando(false);
  }

  function seleccionarCat(slug: string) {
    const nueva = catActiva === slug ? '' : slug;
    setCatActiva(nueva);
    cargarProductos(nueva);
  }

  const filtrados = busqueda
    ? productos.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.marca?.toLowerCase().includes(busqueda.toLowerCase()))
    : productos;

  return (
    <div className="min-h-screen">
      {/* NAV */}
      <nav className="bg-navy text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-navy font-extrabold text-sm">iS</span>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">iSolar</h1>
              <p className="text-xs text-blue-200">Energias Renovables</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://wa.me/573000000000" target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 bg-solar hover:bg-solar-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition">
              WhatsApp
            </a>
            <Link href="/admin" className="text-blue-200 hover:text-white text-sm">
              Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-gradient-to-br from-navy via-navy-dark to-navy text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-4">Energia Solar para Colombia</h2>
          <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
            Equipos de energia solar de alta calidad. Paneles, inversores, baterias, controladores y todo lo que necesitas para tu proyecto solar.
          </p>
          <a href="#catalogo" className="inline-block bg-solar hover:bg-solar-dark text-white px-8 py-3 rounded-lg font-semibold text-lg transition">
            Ver Catalogo
          </a>
        </div>
      </section>

      {/* CATALOGO */}
      <section id="catalogo" className="max-w-7xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold text-navy mb-6">Nuestros Productos</h3>

        {/* Busqueda */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent outline-none"
          />
        </div>

        {/* Categorias */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => seleccionarCat('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              catActiva === '' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          {categorias.map(c => (
            <button
              key={c.slug}
              onClick={() => seleccionarCat(c.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                catActiva === c.slug ? 'bg-navy text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {CATEGORY_ICONS[c.slug] || '📦'} {c.nombre}
            </button>
          ))}
        </div>

        {/* Grid de productos */}
        {cargando ? (
          <div className="text-center py-12 text-gray-500">Cargando productos...</div>
        ) : filtrados.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No se encontraron productos</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtrados.map(p => (
              <div key={p.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition group">
                <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                  {p.imagen_url ? (
                    <img src={p.imagen_url} alt={p.nombre} className="max-h-full object-contain" />
                  ) : (
                    <div className="text-6xl opacity-20">{CATEGORY_ICONS[p.categoria_slug] || '📦'}</div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-accent font-medium mb-1">{p.categoria_nombre}</p>
                  <h4 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">{p.nombre}</h4>
                  {p.marca && <p className="text-xs text-gray-500 mb-2">{p.marca} {p.referencia && `- ${p.referencia}`}</p>}
                  {p.precio > 0 && (
                    <div className="flex items-baseline gap-2">
                      {p.precio_oferta ? (
                        <>
                          <span className="text-lg font-bold text-solar">{formatPrice(p.precio_oferta)}</span>
                          <span className="text-sm text-gray-400 line-through">{formatPrice(p.precio)}</span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-navy">{formatPrice(p.precio)}</span>
                      )}
                    </div>
                  )}
                  {Object.keys(p.specs || {}).length > 0 && (
                    <div className="mt-2 space-y-0.5">
                      {Object.entries(p.specs).slice(0, 3).map(([k, v]) => (
                        <p key={k} className="text-xs text-gray-500"><span className="font-medium">{k}:</span> {v}</p>
                      ))}
                    </div>
                  )}
                  <a
                    href={`https://wa.me/573000000000?text=Hola, me interesa el producto: ${p.nombre}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 block w-full text-center bg-solar hover:bg-solar-dark text-white py-2 rounded-lg text-sm font-medium transition"
                  >
                    Cotizar por WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="bg-navy-dark text-white py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-bold text-lg mb-2">iSolar - Energias Renovables</p>
          <p className="text-blue-200 text-sm">Colombia</p>
          <p className="text-blue-300 text-xs mt-4">Desarrollado por RedNode Tech Consulting SAS</p>
        </div>
      </footer>
    </div>
  );
}
