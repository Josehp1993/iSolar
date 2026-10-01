'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type Tab = 'dashboard' | 'negociaciones' | 'productos' | 'clientes' | 'pedidos' | 'usuarios';

interface User { id: number; nombre: string; email: string; rol: string }

function authHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

function fmt(n: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);
}

// ─── Dashboard Tab ───
function DashboardTab() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { fetch('/api/dashboard').then(r => r.json()).then(setData); }, []);
  if (!data) return <p className="text-center py-12 text-gray-500">Cargando...</p>;

  const cards = [
    { label: 'Productos activos', value: data.productos?.activos || 0, color: 'bg-navy' },
    { label: 'Sin stock', value: data.productos?.sin_stock || 0, color: 'bg-red-600' },
    { label: 'Negociaciones', value: data.negociaciones?.total || 0, color: 'bg-accent' },
    { label: 'Ventas del mes', value: fmt(Number(data.ventasMes?.total_ventas || 0)), color: 'bg-solar' },
    { label: 'Pedidos aprobados', value: data.pedidos?.aprobados || 0, color: 'bg-green-600' },
    { label: 'Ingresos mes', value: fmt(Number(data.pedidos?.ingresos || 0)), color: 'bg-navy-light' },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className={`${c.color} text-white rounded-xl p-5`}>
            <p className="text-sm opacity-80">{c.label}</p>
            <p className="text-2xl font-bold mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-5">
          <h3 className="font-semibold text-navy mb-3">Pipeline</h3>
          {(data.pipeline || []).map((p: any) => (
            <div key={p.estado} className="flex justify-between py-1.5 border-b last:border-0">
              <span className="capitalize">{p.estado}</span>
              <span className="font-semibold">{p.count}</span>
            </div>
          ))}
        </div>
        <div className="bg-white border rounded-xl p-5">
          <h3 className="font-semibold text-navy mb-3">Fuentes</h3>
          {(data.fuentes || []).map((f: any) => (
            <div key={f.fuente} className="flex justify-between py-1.5 border-b last:border-0">
              <span className="capitalize">{f.fuente || 'Sin fuente'}</span>
              <span className="font-semibold">{f.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Negociaciones Tab ───
function NegociacionesTab() {
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ cliente_id: '', nombre_cliente: '', email_cliente: '', telefono_cliente: '', empresa: '', fuente: 'web', descripcion: '', valor_cotizacion: '' });
  const [detail, setDetail] = useState<any>(null);
  const [seguimientos, setSeguimientos] = useState<any[]>([]);
  const [nuevoSeg, setNuevoSeg] = useState('');

  const load = useCallback(() => {
    const url = filter ? `/api/negociaciones?estado=${filter}` : '/api/negociaciones';
    fetch(url).then(r => r.json()).then(setItems);
  }, [filter]);
  useEffect(() => { load(); }, [load]);

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/negociaciones', { method: 'POST', headers: authHeaders(), body: JSON.stringify(form) });
    setShowForm(false);
    setForm({ cliente_id: '', nombre_cliente: '', email_cliente: '', telefono_cliente: '', empresa: '', fuente: 'web', descripcion: '', valor_cotizacion: '' });
    load();
  }

  async function cambiarEstado(id: number, estado: string) {
    await fetch(`/api/negociaciones/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify({ estado }) });
    load();
    if (detail?.id === id) setDetail({ ...detail, estado });
  }

  async function openDetail(neg: any) {
    setDetail(neg);
    const res = await fetch(`/api/seguimientos?negociacion_id=${neg.id}`);
    setSeguimientos(await res.json());
  }

  async function addSeguimiento() {
    if (!nuevoSeg.trim()) return;
    await fetch('/api/seguimientos', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ negociacion_id: detail.id, mensaje: nuevoSeg }) });
    setNuevoSeg('');
    const res = await fetch(`/api/seguimientos?negociacion_id=${detail.id}`);
    setSeguimientos(await res.json());
  }

  const estados = ['lead', 'contactado', 'cotizado', 'negociacion', 'cerrado', 'perdido'];
  const estadoColor: Record<string, string> = {
    lead: 'bg-blue-100 text-blue-800', contactado: 'bg-yellow-100 text-yellow-800',
    cotizado: 'bg-purple-100 text-purple-800', negociacion: 'bg-orange-100 text-orange-800',
    cerrado: 'bg-green-100 text-green-800', perdido: 'bg-red-100 text-red-800',
  };

  if (detail) return (
    <div>
      <button onClick={() => setDetail(null)} className="text-navy font-semibold mb-4 hover:underline">&larr; Volver</button>
      <div className="bg-white border rounded-xl p-6 mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <h3 className="text-xl font-bold text-navy">{detail.cliente_nombre || detail.nombre_cliente}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoColor[detail.estado]}`}>{detail.estado}</span>
        </div>
        <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
          <p>Email: {detail.cliente_email || detail.email_cliente || '-'}</p>
          <p>Telefono: {detail.cliente_telefono || detail.telefono_cliente || '-'}</p>
          <p>Empresa: {detail.empresa || '-'}</p>
          <p>Fuente: {detail.fuente || '-'}</p>
          {detail.valor_cotizacion && <p>Cotizacion: {fmt(Number(detail.valor_cotizacion))}</p>}
          {detail.valor_cierre && <p>Cierre: {fmt(Number(detail.valor_cierre))}</p>}
        </div>
        <p className="text-sm mb-4">{detail.descripcion}</p>
        <div className="flex flex-wrap gap-2">
          {estados.map(e => (
            <button key={e} onClick={() => cambiarEstado(detail.id, e)} disabled={detail.estado === e}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${detail.estado === e ? 'bg-navy text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6">
        <h4 className="font-semibold text-navy mb-4">Seguimientos</h4>
        <div className="flex gap-2 mb-4">
          <input value={nuevoSeg} onChange={e => setNuevoSeg(e.target.value)} placeholder="Agregar nota..."
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-navy focus:outline-none" />
          <button onClick={addSeguimiento} className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-navy-dark">Agregar</button>
        </div>
        {seguimientos.map(s => (
          <div key={s.id} className="border-b py-3 last:border-0">
            <p className="text-sm">{s.mensaje}</p>
            <p className="text-xs text-gray-400 mt-1">{new Date(s.created_at).toLocaleString('es-CO')}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select value={filter} onChange={e => setFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
          <option value="">Todos</option>
          {estados.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
        <button onClick={() => setShowForm(!showForm)} className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-navy-dark ml-auto">
          {showForm ? 'Cancelar' : '+ Nueva'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={crear} className="bg-white border rounded-xl p-5 mb-6 grid md:grid-cols-2 gap-3">
          <input required placeholder="Nombre cliente" value={form.nombre_cliente} onChange={e => setForm({ ...form, nombre_cliente: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm" />
          <input type="email" placeholder="Email" value={form.email_cliente} onChange={e => setForm({ ...form, email_cliente: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Telefono" value={form.telefono_cliente} onChange={e => setForm({ ...form, telefono_cliente: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Empresa" value={form.empresa} onChange={e => setForm({ ...form, empresa: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm" />
          <select value={form.fuente} onChange={e => setForm({ ...form, fuente: e.target.value })} className="border rounded-lg px-3 py-2 text-sm">
            <option value="web">Web</option><option value="whatsapp">WhatsApp</option><option value="referido">Referido</option>
            <option value="redes">Redes</option><option value="telefono">Telefono</option><option value="otro">Otro</option>
          </select>
          <input placeholder="Valor cotizacion" type="number" value={form.valor_cotizacion} onChange={e => setForm({ ...form, valor_cotizacion: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm" />
          <textarea placeholder="Descripcion" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm md:col-span-2" rows={2} />
          <button type="submit" className="bg-solar text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-solar-dark md:col-span-2">Crear negociacion</button>
        </form>
      )}

      <div className="space-y-3">
        {items.map((n: any) => (
          <div key={n.id} onClick={() => openDetail(n)} className="bg-white border rounded-xl p-4 cursor-pointer hover:shadow-md transition">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-navy">{n.cliente_nombre || n.nombre_cliente}</p>
                <p className="text-sm text-gray-500">{n.empresa || n.cliente_email || ''}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoColor[n.estado]}`}>{n.estado}</span>
                {n.valor_cotizacion && <p className="text-sm font-semibold mt-1">{fmt(Number(n.valor_cotizacion))}</p>}
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-gray-400 py-8">No hay negociaciones</p>}
      </div>
    </div>
  );
}

// ─── Productos Tab ───
function ProductosTab() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', categoria_id: '', precio: '', stock: '', referencia: '', descripcion: '', marca: '' });
  const [categorias, setCategorias] = useState<any[]>([]);

  const load = useCallback(() => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    fetch(`/api/productos${params}`).then(r => r.json()).then(setItems);
  }, [search]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { fetch('/api/categorias').then(r => r.json()).then(setCategorias); }, []);

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await fetch(`/api/productos/${editing.id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(form) });
    } else {
      await fetch('/api/productos', { method: 'POST', headers: authHeaders(), body: JSON.stringify(form) });
    }
    setShowForm(false);
    setEditing(null);
    setForm({ nombre: '', categoria_id: '', precio: '', stock: '', referencia: '', descripcion: '', marca: '' });
    load();
  }

  function editar(p: any) {
    setForm({ nombre: p.nombre, categoria_id: p.categoria_id || '', precio: p.precio || '', stock: p.stock || '', referencia: p.referencia || '', descripcion: p.descripcion || '', marca: p.marca || '' });
    setEditing(p);
    setShowForm(true);
  }

  async function eliminar(id: number) {
    if (!confirm('Desactivar este producto?')) return;
    await fetch(`/api/productos/${id}`, { method: 'DELETE', headers: authHeaders() });
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar productos..."
          className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px]" />
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ nombre: '', categoria_id: '', precio: '', stock: '', referencia: '', descripcion: '', marca: '' }); }}
          className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-navy-dark">
          {showForm && !editing ? 'Cancelar' : '+ Nuevo'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={guardar} className="bg-white border rounded-xl p-5 mb-6 grid md:grid-cols-2 gap-3">
          <input required placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm" />
          <select value={form.categoria_id} onChange={e => setForm({ ...form, categoria_id: e.target.value })} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">Categoria</option>
            {categorias.map((c: any) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
          <input placeholder="Marca" value={form.marca} onChange={e => setForm({ ...form, marca: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Referencia" value={form.referencia} onChange={e => setForm({ ...form, referencia: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm" />
          <input type="number" placeholder="Precio" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm" />
          <input type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm" />
          <textarea placeholder="Descripcion" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm md:col-span-2" rows={2} />
          <button type="submit" className="bg-solar text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-solar-dark md:col-span-2">
            {editing ? 'Actualizar' : 'Crear producto'}
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="py-2 pr-3">Nombre</th>
              <th className="py-2 pr-3 hidden md:table-cell">Marca</th>
              <th className="py-2 pr-3">Precio</th>
              <th className="py-2 pr-3">Stock</th>
              <th className="py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p: any) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="py-2.5 pr-3 font-medium">{p.nombre}</td>
                <td className="py-2.5 pr-3 hidden md:table-cell text-gray-500">{p.marca || '-'}</td>
                <td className="py-2.5 pr-3">{p.precio ? fmt(Number(p.precio)) : '-'}</td>
                <td className="py-2.5 pr-3">
                  <span className={`font-semibold ${Number(p.stock) === 0 ? 'text-red-600' : 'text-green-600'}`}>{p.stock ?? '-'}</span>
                </td>
                <td className="py-2.5">
                  <button onClick={() => editar(p)} className="text-navy hover:underline mr-3 text-xs font-semibold">Editar</button>
                  <button onClick={() => eliminar(p.id)} className="text-red-600 hover:underline text-xs font-semibold">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <p className="text-center text-gray-400 py-8">No hay productos</p>}
      </div>
    </div>
  );
}

// ─── Clientes Tab ───
function ClientesTab() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', empresa: '', ciudad: '' });

  const load = useCallback(() => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    fetch(`/api/clientes${params}`).then(r => r.json()).then(setItems);
  }, [search]);
  useEffect(() => { load(); }, [load]);

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/clientes', { method: 'POST', headers: authHeaders(), body: JSON.stringify(form) });
    setShowForm(false);
    setForm({ nombre: '', email: '', telefono: '', empresa: '', ciudad: '' });
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar clientes..."
          className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px]" />
        <button onClick={() => setShowForm(!showForm)} className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-navy-dark ml-auto">
          {showForm ? 'Cancelar' : '+ Nuevo'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={crear} className="bg-white border rounded-xl p-5 mb-6 grid md:grid-cols-2 gap-3">
          <input required placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm" />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Telefono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Empresa" value={form.empresa} onChange={e => setForm({ ...form, empresa: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Ciudad" value={form.ciudad} onChange={e => setForm({ ...form, ciudad: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm" />
          <button type="submit" className="bg-solar text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-solar-dark md:col-span-2">Crear cliente</button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="py-2 pr-3">Nombre</th>
              <th className="py-2 pr-3 hidden md:table-cell">Email</th>
              <th className="py-2 pr-3">Telefono</th>
              <th className="py-2 pr-3 hidden md:table-cell">Empresa</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c: any) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="py-2.5 pr-3 font-medium">{c.nombre}</td>
                <td className="py-2.5 pr-3 hidden md:table-cell text-gray-500">{c.email || '-'}</td>
                <td className="py-2.5 pr-3">{c.telefono || '-'}</td>
                <td className="py-2.5 pr-3 hidden md:table-cell">{c.empresa || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <p className="text-center text-gray-400 py-8">No hay clientes</p>}
      </div>
    </div>
  );
}

// ─── Pedidos Tab ───
function PedidosTab() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { fetch('/api/pedidos').then(r => r.json()).then(setItems); }, []);

  const estadoColor: Record<string, string> = {
    pendiente: 'bg-yellow-100 text-yellow-800', aprobado: 'bg-green-100 text-green-800',
    rechazado: 'bg-red-100 text-red-800', enviado: 'bg-blue-100 text-blue-800',
    entregado: 'bg-emerald-100 text-emerald-800', cancelado: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="py-2 pr-3">Referencia</th>
            <th className="py-2 pr-3 hidden md:table-cell">Cliente</th>
            <th className="py-2 pr-3">Total</th>
            <th className="py-2 pr-3">Estado</th>
            <th className="py-2 hidden md:table-cell">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p: any) => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="py-2.5 pr-3 font-mono text-xs">{p.referencia}</td>
              <td className="py-2.5 pr-3 hidden md:table-cell">{p.cliente_nombre || '-'}</td>
              <td className="py-2.5 pr-3 font-semibold">{fmt(Number(p.total))}</td>
              <td className="py-2.5 pr-3">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${estadoColor[p.estado] || ''}`}>{p.estado}</span>
              </td>
              <td className="py-2.5 hidden md:table-cell text-gray-400 text-xs">{new Date(p.created_at).toLocaleDateString('es-CO')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && <p className="text-center text-gray-400 py-8">No hay pedidos</p>}
    </div>
  );
}

// ─── Usuarios Tab ───
function UsuariosTab({ currentUser }: { currentUser: User | null }) {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'asesor' });

  useEffect(() => { fetch('/api/usuarios').then(r => r.json()).then(setItems); }, []);

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/usuarios', { method: 'POST', headers: authHeaders(), body: JSON.stringify(form) });
    if (res.ok) {
      setShowForm(false);
      setForm({ nombre: '', email: '', password: '', rol: 'asesor' });
      const data = await fetch('/api/usuarios').then(r => r.json());
      setItems(data);
    }
  }

  const isSuperadmin = currentUser?.rol === 'superadmin';

  return (
    <div>
      {isSuperadmin && (
        <div className="flex justify-end mb-6">
          <button onClick={() => setShowForm(!showForm)} className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-navy-dark">
            {showForm ? 'Cancelar' : '+ Nuevo usuario'}
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={crear} className="bg-white border rounded-xl p-5 mb-6 grid md:grid-cols-2 gap-3">
          <input required placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm" />
          <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm" />
          <input required type="password" placeholder="Contrasena" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm" />
          <select value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })} className="border rounded-lg px-3 py-2 text-sm">
            <option value="asesor">Asesor</option><option value="consulta">Consulta</option><option value="superadmin">Superadmin</option>
          </select>
          <button type="submit" className="bg-solar text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-solar-dark md:col-span-2">Crear usuario</button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="py-2 pr-3">Nombre</th>
              <th className="py-2 pr-3">Email</th>
              <th className="py-2 pr-3">Rol</th>
              <th className="py-2 pr-3 hidden md:table-cell">Creado</th>
            </tr>
          </thead>
          <tbody>
            {items.map((u: any) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="py-2.5 pr-3 font-medium">{u.nombre}</td>
                <td className="py-2.5 pr-3 text-gray-500">{u.email}</td>
                <td className="py-2.5 pr-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${u.rol === 'superadmin' ? 'bg-navy text-white' : u.rol === 'asesor' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                    {u.rol}
                  </span>
                </td>
                <td className="py-2.5 pr-3 hidden md:table-cell text-gray-400 text-xs">{new Date(u.created_at).toLocaleDateString('es-CO')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Admin Page ───
export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const stored = localStorage.getItem('user');
    if (!token || !stored) { router.push('/admin/login'); return; }
    try { setUser(JSON.parse(stored)); } catch { router.push('/admin/login'); }
  }, [router]);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'negociaciones', label: 'Negociaciones' },
    { key: 'productos', label: 'Productos' },
    { key: 'clientes', label: 'Clientes' },
    { key: 'pedidos', label: 'Pedidos' },
    { key: 'usuarios', label: 'Usuarios' },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-navy text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-montserrat font-bold">iSolar CRM</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm opacity-80 hidden sm:inline">{user.nombre}</span>
            <button onClick={logout} className="text-sm bg-white/10 px-3 py-1 rounded hover:bg-white/20">Salir</button>
          </div>
        </div>
        <nav className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto pb-1">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm font-semibold rounded-t-lg whitespace-nowrap transition ${tab === t.key ? 'bg-gray-50 text-navy' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {tab === 'dashboard' && <DashboardTab />}
        {tab === 'negociaciones' && <NegociacionesTab />}
        {tab === 'productos' && <ProductosTab />}
        {tab === 'clientes' && <ClientesTab />}
        {tab === 'pedidos' && <PedidosTab />}
        {tab === 'usuarios' && <UsuariosTab currentUser={user} />}
      </main>
    </div>
  );
}
