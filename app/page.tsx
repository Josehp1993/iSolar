'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

interface Producto {
  id: number;
  nombre: string;
  marca: string;
  referencia: string;
  precio: number;
  precio_oferta: number | null;
  categoria_nombre: string;
  categoria_slug: string;
  specs: Record<string, string>;
  features: string[];
  stock: number;
  imagen_url?: string;
}

interface Categoria {
  id: number;
  nombre: string;
  slug: string;
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);
}

function SpinningSun() {
  return (
    <div className="relative w-[280px] h-[280px] flex items-center justify-center">
      <div className="absolute inset-[-40px] rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, rgba(46,139,62,.15), transparent 70%)' }} />
      <svg className="absolute inset-0 animate-[spin_30s_linear_infinite]" viewBox="0 0 280 280" fill="none">
        <line x1="140" y1="10" x2="140" y2="50" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round"/>
        <line x1="140" y1="230" x2="140" y2="270" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round"/>
        <line x1="10" y1="140" x2="50" y2="140" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round"/>
        <line x1="230" y1="140" x2="270" y2="140" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round"/>
        <line x1="48" y1="48" x2="76" y2="76" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round"/>
        <line x1="204" y1="204" x2="232" y2="232" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round"/>
        <line x1="48" y1="232" x2="76" y2="204" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round"/>
        <line x1="204" y1="76" x2="232" y2="48" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round"/>
      </svg>
      <svg className="relative z-10 w-[120px] h-[120px]" viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r="45" stroke="#2E8B3E" strokeWidth="3"/>
        <circle cx="60" cy="60" r="30" stroke="#2E8B3E" strokeWidth="2.5"/>
        <circle cx="60" cy="60" r="17" stroke="#2E8B3E" strokeWidth="2"/>
        <circle cx="60" cy="60" r="7" fill="#2E8B3E"/>
      </svg>
    </div>
  );
}

function CartIcon({ count }: { count: number }) {
  return (
    <Link href="/carrito" className="relative flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-navy hover:bg-gray-100 transition">
      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
      </svg>
      <span className="hidden sm:inline">Carrito</span>
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-solar text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-[300] bg-navy text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-[slideUp_0.3s_ease]">
      <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-solar fill-none" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

export default function HomePage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [catActiva, setCatActiva] = useState('paneles');
  const [modal, setModal] = useState<Producto | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [toast, setToast] = useState('');
  const cart = useCart();

  useEffect(() => {
    fetch('/api/categorias').then(r => r.json()).then(setCategorias).catch(() => {});
    fetch('/api/productos').then(r => r.json()).then(d => { setProductos(d); setCargando(false); }).catch(() => setCargando(false));
  }, []);

  function handleAddToCart(p: Producto) {
    if (Number(p.precio) <= 0 || Number(p.stock) <= 0) return;
    const precioFinal = p.precio_oferta != null && Number(p.precio_oferta) > 0 && Number(p.precio_oferta) < Number(p.precio) ? Number(p.precio_oferta) : Number(p.precio);
    cart.addItem({ id: p.id, nombre: p.nombre, precio: precioFinal, stock: Number(p.stock), imagen_url: p.imagen_url, marca: p.marca });
    setToast(`${p.nombre} agregado al carrito`);
  }

  const filtrados = productos.filter(p => p.categoria_slug === catActiva);

  const catCounts = productos.reduce((acc, p) => {
    acc[p.categoria_slug] = (acc[p.categoria_slug] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen font-montserrat" style={{ background: '#fafafa', color: '#2c3e50' }}>
      <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1140px] mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center">
            <img src="/logo-isolar.jpg" alt="iSolar Energias Renovables" className="h-10 w-auto" />
          </a>
          <div className="flex items-center gap-1">
            <ul className={`${menuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:static top-16 left-0 right-0 bg-white md:bg-transparent border-b md:border-0 shadow-lg md:shadow-none p-4 md:p-0 gap-1 items-stretch md:items-center z-50`}>
              <li><a href="#catalogo" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-navy hover:bg-gray-100 transition">Catalogo</a></li>
              <li><a href="#nosotros" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-navy hover:bg-gray-100 transition">Nosotros</a></li>
              <li><a href="#contacto" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-navy hover:bg-gray-100 transition">Contacto</a></li>
              <li className="md:hidden">
                <Link href="/carrito" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-navy hover:bg-gray-100 transition">
                  Carrito {cart.count > 0 && `(${cart.count})`}
                </Link>
              </li>
              <li>
                <a href="https://wa.me/573001234567?text=Hola%2C%20quiero%20cotizar%20equipos%20solares" target="_blank" rel="noopener noreferrer"
                  className="block px-5 py-2 rounded-md text-sm font-semibold bg-solar text-white hover:bg-solar-dark transition md:ml-2 text-center">
                  Cotizar
                </a>
              </li>
            </ul>
            <div className="hidden md:block">
              <CartIcon count={cart.count} />
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-[5px] p-1.5">
              <span className="block w-[22px] h-[2px] bg-gray-800 rounded" />
              <span className="block w-[22px] h-[2px] bg-gray-800 rounded" />
              <span className="block w-[22px] h-[2px] bg-gray-800 rounded" />
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-navy pt-28 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-[1140px] mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <h1 className="text-white font-bold leading-tight mb-5" style={{ fontSize: 'clamp(30px, 4.5vw, 48px)', letterSpacing: '-0.5px' }}>
              Equipos de energia solar para cada proyecto
            </h1>
            <p className="text-white/65 text-[17px] leading-relaxed mb-8 max-w-[500px]">
              Paneles, inversores, baterias, controladores y accesorios con certificacion RETIE. Asesoria tecnica y envio a todo Colombia.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#catalogo" className="inline-flex items-center gap-1.5 px-6 py-3 rounded-lg font-semibold text-sm bg-solar text-white hover:bg-solar-dark transition">
                Ver catalogo
              </a>
              <a href="https://wa.me/573001234567?text=Hola%2C%20necesito%20asesoria%20para%20un%20sistema%20solar" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-6 py-3 rounded-lg font-semibold text-sm text-white border border-white/25 hover:border-white/50 transition">
                Solicitar asesoria
              </a>
            </div>
          </div>
          <div className="hidden md:flex justify-center items-center">
            <SpinningSun />
          </div>
        </div>
      </section>

      {/* CATALOGO */}
      <section id="catalogo" className="scroll-mt-[72px] py-16 px-6">
        <div className="max-w-[1140px] mx-auto">
          <div className="mb-10">
            <h2 className="text-[28px] font-bold text-navy mb-1.5">Catalogo de productos</h2>
            <p className="text-gray-500 text-[15px]">Selecciona una categoria para explorar los equipos disponibles</p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-1.5 mb-8 pb-4 border-b border-gray-200">
            {categorias.map(c => (
              <button key={c.slug} onClick={() => setCatActiva(c.slug)}
                className={`px-5 py-2 rounded-md text-[13px] font-semibold transition ${
                  catActiva === c.slug
                    ? 'bg-navy text-white'
                    : 'text-gray-500 hover:text-navy hover:bg-gray-100'
                }`}>
                {c.nombre}
                <span className="ml-1 text-[11px] font-medium opacity-70">({catCounts[c.slug] || 0})</span>
              </button>
            ))}
          </div>

          {/* Products grid */}
          {cargando ? (
            <p className="text-center py-12 text-gray-400 text-[15px]">Cargando productos...</p>
          ) : filtrados.length === 0 ? (
            <p className="text-center py-12 text-gray-400 text-[15px]">No hay productos en esta categoria.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtrados.map(p => {
                const specs = Object.entries(p.specs || {}).slice(0, 3);
                return (
                  <div key={p.id} onClick={() => setModal(p)}
                    className="bg-white border border-gray-200 rounded-lg p-5 cursor-pointer transition hover:border-solar hover:shadow-md">
                    <div className="flex justify-between items-start mb-2.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-accent bg-blue-50 px-2 py-0.5 rounded">
                        {p.marca}
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium">{p.categoria_nombre}</span>
                    </div>
                    <h3 className="text-[15px] font-semibold text-navy mb-2.5 leading-snug">{p.nombre}</h3>
                    {specs.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3.5">
                        {specs.map(([, v]) => (
                          <span key={v} className="text-[12px] px-2 py-0.5 bg-gray-100 rounded text-gray-500 font-medium">{v}</span>
                        ))}
                      </div>
                    )}
                    {Number(p.precio) > 0 && (
                      <div className="mb-3">
                        {p.precio_oferta != null && Number(p.precio_oferta) > 0 && Number(p.precio_oferta) < Number(p.precio) ? (
                          <>
                            <p className="text-[13px] text-gray-400 line-through">{formatPrice(Number(p.precio))}</p>
                            <p className="text-[16px] font-bold text-red-600">{formatPrice(Number(p.precio_oferta))}</p>
                          </>
                        ) : (
                          <p className="text-[16px] font-bold text-solar">{formatPrice(Number(p.precio))}</p>
                        )}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button onClick={e => { e.stopPropagation(); window.open(`https://wa.me/573001234567?text=${encodeURIComponent('Hola, me interesa cotizar: ' + p.nombre)}`, '_blank'); }}
                        className="flex-1 text-center py-[7px] px-3.5 rounded-md text-[13px] font-semibold bg-solar text-white hover:bg-solar-dark transition">
                        Cotizar
                      </button>
                      {Number(p.precio) > 0 && Number(p.stock) > 0 && (
                        <button onClick={e => { e.stopPropagation(); handleAddToCart(p); }}
                          className="flex-1 text-center py-[7px] px-3.5 rounded-md text-[13px] font-semibold text-navy border border-gray-200 hover:border-navy transition flex items-center justify-center gap-1">
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-current fill-none" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
                          Agregar
                        </button>
                      )}
                      {(Number(p.precio) <= 0 || Number(p.stock) <= 0) && (
                        <button onClick={e => { e.stopPropagation(); setModal(p); }}
                          className="flex-1 text-center py-[7px] px-3.5 rounded-md text-[13px] font-semibold text-navy border border-gray-200 hover:border-navy transition">
                          Ver detalles
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* POR QUE iSOLAR */}
      <section id="nosotros" className="scroll-mt-[72px] bg-white border-t border-b border-gray-200 py-16 px-6">
        <div className="max-w-[1140px] mx-auto">
          <h2 className="text-[24px] font-bold text-navy mb-8">Por que trabajar con iSolar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Certificacion RETIE', desc: 'Productos certificados para sistemas fotovoltaicos conectados a red en Colombia.' },
              { title: 'Garantia de fabrica', desc: 'Hasta 12 anos en paneles solares y 10 anos en inversores on grid.' },
              { title: 'Asesoria tecnica', desc: 'Dimensionamiento gratuito de tu sistema solar. Te ayudamos a elegir los equipos correctos.' },
              { title: 'Envio nacional', desc: 'Despacho a todo Colombia con empaque protector especializado para equipos solares.' },
            ].map(item => (
              <div key={item.title}>
                <div className="w-8 h-[3px] bg-solar rounded mb-3.5" />
                <h3 className="text-[15px] font-semibold text-navy mb-1.5">{item.title}</h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARCAS */}
      <section className="py-12 px-6 text-center">
        <div className="max-w-[1140px] mx-auto">
          <h3 className="text-[13px] font-semibold uppercase tracking-[1.5px] text-gray-400 mb-5">Marcas que distribuimos</h3>
          <div className="flex flex-wrap justify-center gap-x-9 gap-y-3">
            {['TW Solar', 'Astronergy', 'Runergy', 'SolaX', 'SAJ', 'SRNE', 'Belttt', 'GreenPoint', 'ZBeny', 'CoSostenible'].map(m => (
              <span key={m} className="text-[15px] font-semibold text-gray-500 tracking-wide">{m}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="scroll-mt-[72px] bg-white py-16 px-6">
        <div className="max-w-[1140px] mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-[28px] font-bold text-navy mb-3">Solicita tu cotizacion</h2>
            <p className="text-gray-500 text-[15px] leading-relaxed mb-7">
              Cuentanos sobre tu proyecto y te enviamos una propuesta personalizada con los equipos ideales para tu instalacion.
            </p>
            <div className="space-y-3.5">
              {[
                { icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z', text: 'WhatsApp: +57 300 123 4567' },
                { icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6', text: 'ventas@isolar.com.co' },
                { icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 10m-3 0a3 3 0 106 0 3 3 0 00-6 0', text: 'Colombia' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-3 text-[14px]">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-navy fill-none" strokeWidth="2"><path d={item.icon} /></svg>
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={e => { e.preventDefault(); const btn = e.currentTarget.querySelector('button') as HTMLButtonElement; btn.textContent = 'Enviado'; setTimeout(() => { btn.textContent = 'Enviar solicitud'; (e.target as HTMLFormElement).reset(); }, 3000); }}
            className="border border-gray-200 rounded-lg p-7" style={{ background: '#fafafa' }}>
            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-navy mb-1">Nombre</label>
              <input type="text" required placeholder="Tu nombre" className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-[14px] bg-white focus:border-solar outline-none transition" />
            </div>
            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-navy mb-1">Telefono / WhatsApp</label>
              <input type="tel" required placeholder="+57 ..." className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-[14px] bg-white focus:border-solar outline-none transition" />
            </div>
            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-navy mb-1">Email</label>
              <input type="email" placeholder="tu@email.com" className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-[14px] bg-white focus:border-solar outline-none transition" />
            </div>
            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-navy mb-1">Tipo de proyecto</label>
              <select className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-[14px] bg-white focus:border-solar outline-none transition">
                <option value="">Selecciona...</option>
                <option>Residencial</option>
                <option>Comercial</option>
                <option>Industrial</option>
                <option>Rural / Off Grid</option>
                <option>On Grid / Inyeccion a red</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-navy mb-1">Mensaje</label>
              <textarea placeholder="Describe tu proyecto o los equipos que necesitas..." rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-[14px] bg-white focus:border-solar outline-none transition resize-y" />
            </div>
            <button type="submit" className="w-full py-3 rounded-lg font-semibold text-[14px] bg-solar text-white hover:bg-solar-dark transition">
              Enviar solicitud
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-navy-dark py-9 px-6">
        <div className="max-w-[1140px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[14px] font-semibold text-white/80">iSolar Energias Renovables</span>
          <ul className="flex gap-5">
            {['Catalogo', 'Nosotros', 'Contacto'].map(l => (
              <li key={l}><a href={`#${l.toLowerCase()}`} className="text-[13px] text-white/50 hover:text-white/90 transition">{l}</a></li>
            ))}
          </ul>
          <span className="text-[13px] text-white/40">2024 iSolar. Todos los derechos reservados.</span>
        </div>
      </footer>

      {/* MODAL DETALLE */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-6" onClick={() => setModal(null)}>
          <div className="bg-white rounded-xl max-w-[640px] w-full max-h-[85vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition text-[16px]">
              x
            </button>
            <div className="px-6 pt-6 pb-4 border-b border-gray-200">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-accent bg-blue-50 px-2 py-0.5 rounded inline-block mb-2">{modal.marca}</span>
              {modal.referencia && <span className="text-[11px] text-gray-400 ml-2">Ref: {modal.referencia}</span>}
              <h2 className="text-[20px] font-bold text-navy mb-1">{modal.nombre}</h2>
              <p className="text-[13px] text-gray-400">{modal.categoria_nombre}</p>
              {modal.precio > 0 && (
                <div className="mt-2">
                  {modal.precio_oferta != null && Number(modal.precio_oferta) > 0 && Number(modal.precio_oferta) < Number(modal.precio) ? (
                    <>
                      <p className="text-[15px] text-gray-400 line-through">{formatPrice(Number(modal.precio))}</p>
                      <p className="text-[22px] font-bold text-red-600">{formatPrice(Number(modal.precio_oferta))}</p>
                    </>
                  ) : (
                    <p className="text-[22px] font-bold text-solar">{formatPrice(Number(modal.precio))}</p>
                  )}
                </div>
              )}
            </div>
            <div className="px-6 py-6">
              {Object.keys(modal.specs || {}).length > 0 && (
                <>
                  <h3 className="text-[12px] font-semibold uppercase tracking-wider text-gray-400 mb-3">Especificaciones</h3>
                  <table className="w-full mb-6">
                    <tbody>
                      {Object.entries(modal.specs).map(([k, v]) => (
                        <tr key={k} className="border-b border-gray-100">
                          <td className="py-2 text-[14px] font-semibold text-navy w-[45%] pr-4">{k}</td>
                          <td className="py-2 text-[14px]">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
              {(modal.features || []).length > 0 && (
                <>
                  <h3 className="text-[12px] font-semibold uppercase tracking-wider text-gray-400 mb-3">Caracteristicas</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {modal.features.map((f, i) => (
                      <li key={i} className="text-[14px] pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[8px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-solar">
                        {f}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex flex-col sm:flex-row gap-2.5">
              <a href={`https://wa.me/573001234567?text=${encodeURIComponent('Hola, me interesa cotizar: ' + modal.nombre)}`} target="_blank" rel="noopener noreferrer"
                className="flex-1 text-center py-[10px] px-5 rounded-lg font-semibold text-[14px] bg-solar text-white hover:bg-solar-dark transition">
                Cotizar por WhatsApp
              </a>
              {Number(modal.precio) > 0 && Number(modal.stock) > 0 ? (
                <button onClick={() => { handleAddToCart(modal); setModal(null); }}
                  className="flex-1 text-center py-[10px] px-5 rounded-lg font-semibold text-[14px] text-navy border border-gray-200 hover:border-navy transition cursor-pointer flex items-center justify-center gap-2">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
                  Agregar al carrito
                </button>
              ) : (
                <button onClick={() => setModal(null)}
                  className="flex-1 text-center py-[10px] px-5 rounded-lg font-semibold text-[14px] text-navy border border-gray-200 hover:border-navy transition cursor-pointer">
                  Cerrar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}
