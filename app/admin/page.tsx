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

function Pagination({ page, total, perPage, onChange }: { page: number; total: number; perPage: number; onChange: (p: number) => void }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
      <span className="text-xs text-gray-400">{total} registros</span>
      <div className="flex gap-1">
        <button onClick={() => onChange(page - 1)} disabled={page <= 1}
          className="px-2.5 py-1 text-xs rounded border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition">Ant</button>
        {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
          let p: number;
          if (pages <= 7) p = i + 1;
          else if (page <= 4) p = i + 1;
          else if (page >= pages - 3) p = pages - 6 + i;
          else p = page - 3 + i;
          return (
            <button key={p} onClick={() => onChange(p)}
              className={`px-2.5 py-1 text-xs rounded border transition ${p === page ? 'bg-navy text-white border-navy' : 'border-gray-200 hover:bg-gray-50'}`}>
              {p}
            </button>
          );
        })}
        <button onClick={() => onChange(page + 1)} disabled={page >= pages}
          className="px-2.5 py-1 text-xs rounded border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition">Sig</button>
      </div>
    </div>
  );
}

// ─── Dashboard Tab ───
function DashboardTab() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { fetch('/api/dashboard').then(r => r.json()).then(setData); }, []);
  if (!data) return <p className="text-center py-12 text-gray-400">Cargando...</p>;

  const neg = data.negociaciones || {};
  const totalNeg = Number(neg.total) || 0;
  const cerrados = Number(neg.cerrados) || 0;
  const tasa = totalNeg > 0 ? ((cerrados / totalNeg) * 100).toFixed(1) : '0';

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Ventas del mes', value: fmt(Number(data.ventasMes?.total_ventas || 0)), sub: `${data.ventasMes?.num_ventas || 0} cerradas`, color: 'border-l-solar' },
          { label: 'Ingresos pedidos', value: fmt(Number(data.pedidos?.ingresos || 0)), sub: `${data.pedidos?.aprobados || 0} aprobados`, color: 'border-l-green-500' },
          { label: 'Negociaciones', value: totalNeg, sub: `Tasa cierre: ${tasa}%`, color: 'border-l-accent' },
          { label: 'Productos activos', value: data.productos?.activos || 0, sub: `${data.productos?.sin_stock || 0} sin stock`, color: 'border-l-red-500' },
        ].map(c => (
          <div key={c.label} className={`bg-white rounded-lg border border-gray-100 border-l-4 ${c.color} p-4`}>
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">{c.label}</p>
            <p className="text-xl font-bold text-navy mt-1">{c.value}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4 lg:col-span-2">
          <h3 className="text-sm font-semibold text-navy mb-3">Flujo de negociaciones</h3>
          <div className="space-y-2">
            {(data.pipeline || []).map((p: any) => {
              const max = Math.max(...(data.pipeline || []).map((x: any) => Number(x.count)), 1);
              const pct = (Number(p.count) / max) * 100;
              return (
                <div key={p.estado} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-500 w-24 capitalize">{p.estado}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                    <div className="bg-navy/80 h-full rounded-full transition-all flex items-center justify-end pr-2"
                      style={{ width: `${Math.max(pct, 8)}%` }}>
                      <span className="text-[10px] font-semibold text-white">{p.count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {(!data.pipeline || data.pipeline.length === 0) && <p className="text-xs text-gray-400">Sin negociaciones activas</p>}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <h3 className="text-sm font-semibold text-navy mb-3">Fuentes de leads</h3>
          <div className="space-y-2">
            {(data.fuentes || []).map((f: any) => (
              <div key={f.fuente} className="flex justify-between items-center py-1">
                <span className="text-xs text-gray-600 capitalize">{f.fuente || 'Sin fuente'}</span>
                <span className="text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded">{f.count}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-navy mb-3">Pedidos del mes</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center">
                <p className="text-lg font-bold text-navy">{data.pedidos?.pendientes || 0}</p>
                <p className="text-[10px] text-gray-400">Pendientes</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-solar">{data.pedidos?.aprobados || 0}</p>
                <p className="text-[10px] text-gray-400">Aprobados</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Negociaciones Tab ───
function NegociacionesTab() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre_cliente: '', email_cliente: '', telefono_cliente: '', empresa: '', fuente: 'web', descripcion: '', valor_cotizacion: '' });
  const [detail, setDetail] = useState<any>(null);
  const [seguimientos, setSeguimientos] = useState<any[]>([]);
  const [nuevoSeg, setNuevoSeg] = useState('');
  const perPage = 20;

  const load = useCallback(() => {
    let url = `/api/negociaciones?limit=${perPage}&offset=${(page - 1) * perPage}`;
    if (filter) url += `&estado=${filter}`;
    fetch(url).then(r => r.json()).then(d => {
      if (Array.isArray(d)) { setItems(d); setTotal(d.length >= perPage ? page * perPage + 1 : (page - 1) * perPage + d.length); }
      else { setItems(d.rows || d); setTotal(d.total || d.length || 0); }
    });
  }, [filter, page]);
  useEffect(() => { load(); }, [load]);

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/negociaciones', { method: 'POST', headers: authHeaders(), body: JSON.stringify(form) });
    setShowForm(false);
    setForm({ nombre_cliente: '', email_cliente: '', telefono_cliente: '', empresa: '', fuente: 'web', descripcion: '', valor_cotizacion: '' });
    setPage(1); load();
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
  const ec: Record<string, string> = {
    lead: 'bg-blue-50 text-blue-700', contactado: 'bg-yellow-50 text-yellow-700',
    cotizado: 'bg-purple-50 text-purple-700', negociacion: 'bg-orange-50 text-orange-700',
    cerrado: 'bg-green-50 text-green-700', perdido: 'bg-red-50 text-red-700',
  };

  if (detail) return (
    <div>
      <button onClick={() => setDetail(null)} className="text-sm text-navy font-medium hover:underline mb-4">Volver</button>
      <div className="bg-white rounded-lg border border-gray-100 p-5 mb-4">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <h3 className="text-lg font-bold text-navy">{detail.cliente_nombre || detail.nombre_cliente}</h3>
          <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${ec[detail.estado]}`}>{detail.estado}</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-1.5 text-[13px] text-gray-500 mb-4">
          <p>Email: {detail.cliente_email || detail.email_cliente || '-'}</p>
          <p>Telefono: {detail.cliente_telefono || detail.telefono_cliente || '-'}</p>
          <p>Empresa: {detail.empresa || '-'}</p>
          <p>Fuente: {detail.fuente || '-'}</p>
          {detail.valor_cotizacion && <p>Cotizacion: {fmt(Number(detail.valor_cotizacion))}</p>}
          {detail.valor_cierre && <p>Cierre: {fmt(Number(detail.valor_cierre))}</p>}
        </div>
        {detail.descripcion && <p className="text-sm text-gray-600 mb-4">{detail.descripcion}</p>}
        <div className="flex flex-wrap gap-1.5">
          {estados.map(e => (
            <button key={e} onClick={() => cambiarEstado(detail.id, e)} disabled={detail.estado === e}
              className={`px-3 py-1 rounded text-[11px] font-semibold transition ${detail.estado === e ? 'bg-navy text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
              {e}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-100 p-5">
        <h4 className="text-sm font-semibold text-navy mb-3">Seguimientos</h4>
        <div className="flex gap-2 mb-4">
          <input value={nuevoSeg} onChange={e => setNuevoSeg(e.target.value)} placeholder="Agregar nota..."
            className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm focus:border-navy outline-none" />
          <button onClick={addSeguimiento} className="bg-navy text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-navy-dark transition">Agregar</button>
        </div>
        {seguimientos.map(s => (
          <div key={s.id} className="border-b border-gray-50 py-2.5 last:border-0">
            <p className="text-sm">{s.mensaje}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{new Date(s.created_at).toLocaleString('es-CO')}</p>
          </div>
        ))}
        {seguimientos.length === 0 && <p className="text-xs text-gray-400">Sin seguimientos</p>}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }} className="border border-gray-200 rounded-md px-3 py-2 text-sm">
          <option value="">Todos</option>
          {estados.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
        <button onClick={() => setShowForm(!showForm)} className="bg-navy text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-navy-dark transition ml-auto">
          {showForm ? 'Cancelar' : 'Nueva'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={crear} className="bg-white rounded-lg border border-gray-100 p-4 mb-4 grid sm:grid-cols-2 gap-2.5">
          <input required placeholder="Nombre cliente" value={form.nombre_cliente} onChange={e => setForm({ ...form, nombre_cliente: e.target.value })} className="border border-gray-200 rounded-md px-3 py-2 text-sm" />
          <input type="email" placeholder="Email" value={form.email_cliente} onChange={e => setForm({ ...form, email_cliente: e.target.value })} className="border border-gray-200 rounded-md px-3 py-2 text-sm" />
          <input placeholder="Telefono" value={form.telefono_cliente} onChange={e => setForm({ ...form, telefono_cliente: e.target.value })} className="border border-gray-200 rounded-md px-3 py-2 text-sm" />
          <input placeholder="Empresa" value={form.empresa} onChange={e => setForm({ ...form, empresa: e.target.value })} className="border border-gray-200 rounded-md px-3 py-2 text-sm" />
          <select value={form.fuente} onChange={e => setForm({ ...form, fuente: e.target.value })} className="border border-gray-200 rounded-md px-3 py-2 text-sm">
            <option value="web">Web</option><option value="whatsapp">WhatsApp</option><option value="referido">Referido</option>
            <option value="redes">Redes</option><option value="telefono">Telefono</option><option value="otro">Otro</option>
          </select>
          <input placeholder="Valor cotizacion" type="number" value={form.valor_cotizacion} onChange={e => setForm({ ...form, valor_cotizacion: e.target.value })} className="border border-gray-200 rounded-md px-3 py-2 text-sm" />
          <textarea placeholder="Descripcion" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} className="border border-gray-200 rounded-md px-3 py-2 text-sm sm:col-span-2" rows={2} />
          <button type="submit" className="bg-solar text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-solar-dark sm:col-span-2">Crear</button>
        </form>
      )}

      <div className="space-y-2">
        {items.map((n: any) => (
          <div key={n.id} onClick={() => openDetail(n)} className="bg-white rounded-lg border border-gray-100 p-3.5 cursor-pointer hover:border-navy/30 transition">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-navy truncate">{n.cliente_nombre || n.nombre_cliente}</p>
                <p className="text-[11px] text-gray-400 truncate">{n.empresa || n.cliente_email || ''}</p>
              </div>
              <div className="flex items-center gap-2">
                {n.valor_cotizacion && <span className="text-xs font-semibold text-gray-600">{fmt(Number(n.valor_cotizacion))}</span>}
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${ec[n.estado]}`}>{n.estado}</span>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No hay negociaciones</p>}
      </div>
      <Pagination page={page} total={total} perPage={perPage} onChange={setPage} />
    </div>
  );
}

// ─── Productos Tab ───
function ProductosTab() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({ nombre: '', categoria_id: '', precio: '', precio_oferta: '', stock: '', referencia: '', descripcion: '', marca: '', destacado: false, imagen_url: '', imagenes: [] as string[], specs: {}, features: [] as string[], activo: true });
  const [categorias, setCategorias] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const perPage = 25;

  const emptyForm = { nombre: '', categoria_id: '', precio: '', precio_oferta: '', stock: '', referencia: '', descripcion: '', marca: '', destacado: false, imagen_url: '', imagenes: [] as string[], specs: {}, features: [] as string[], activo: true };

  const load = useCallback(() => {
    let url = `/api/productos?limit=${perPage}&offset=${(page - 1) * perPage}`;
    if (search) url += `&q=${encodeURIComponent(search)}`;
    fetch(url).then(r => r.json()).then(d => {
      if (Array.isArray(d)) { setItems(d); setTotal(d.length >= perPage ? page * perPage + 1 : (page - 1) * perPage + d.length); }
      else { setItems(d.rows || d); setTotal(d.total || d.length || 0); }
    });
  }, [search, page]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { fetch('/api/categorias').then(r => r.json()).then(setCategorias); }, []);

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    const slug = form.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
    const payload = {
      ...form,
      slug,
      precio: form.precio !== '' ? Number(form.precio) : 0,
      precio_oferta: form.precio_oferta !== '' ? Number(form.precio_oferta) : null,
      stock: form.stock !== '' ? Number(form.stock) : 0,
      imagen_url: form.imagenes?.[0] || form.imagen_url || '',
      specs: form.specs || {},
      features: form.features || [],
    };
    const url = editing ? `/api/productos/${editing.id}` : '/api/productos';
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(payload) });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert('Error guardando producto: ' + (err.error || res.statusText));
      return;
    }
    setShowForm(false); setEditing(null); setForm(emptyForm); load();
  }

  function editar(p: any) {
    setForm({
      nombre: p.nombre || '', categoria_id: p.categoria_id ?? '', precio: p.precio ?? '', precio_oferta: p.precio_oferta ?? '',
      stock: p.stock ?? '', referencia: p.referencia || '', descripcion: p.descripcion || '', marca: p.marca || '',
      destacado: p.destacado || false, imagen_url: p.imagen_url || '',
      imagenes: Array.isArray(p.imagenes) ? [...p.imagenes] : (p.imagen_url ? [p.imagen_url] : []),
      specs: typeof p.specs === 'string' ? JSON.parse(p.specs) : (p.specs || {}),
      features: p.features || [],
      activo: p.activo ?? true,
    });
    setEditing(p); setShowForm(true);
  }

  async function eliminar(id: number) {
    if (!confirm('Desactivar este producto?')) return;
    await fetch(`/api/productos/${id}`, { method: 'DELETE', headers: authHeaders() });
    load();
  }

  async function uploadFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) return;
    setUploading(true);
    const fd = new FormData();
    files.forEach(f => fd.append('files', f));
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.urls && data.urls.length > 0) {
        setForm((prev: any) => ({ ...prev, imagenes: [...(prev.imagenes || []), ...data.urls] }));
      } else {
        alert('Error al subir imagenes: ' + (data.error || 'respuesta vacia'));
      }
    } catch (err) {
      alert('Error al subir imagenes');
    }
    setUploading(false);
  }

  function removeImage(idx: number) {
    setForm((prev: any) => ({ ...prev, imagenes: prev.imagenes.filter((_: any, i: number) => i !== idx) }));
  }

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= (form.imagenes?.length || 0)) return;
    setForm((prev: any) => {
      const imgs = [...prev.imagenes];
      const [moved] = imgs.splice(from, 1);
      imgs.splice(to, 0, moved);
      return { ...prev, imagenes: imgs };
    });
  }

  function handleDragStart(idx: number) { setDragIdx(idx); }
  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    if (dragIdx !== null && dragIdx !== idx) { moveImage(dragIdx, idx); setDragIdx(idx); }
  }
  function handleDragEnd() { setDragIdx(null); }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Buscar productos..."
          className="border border-gray-200 rounded-md px-3 py-2 text-sm flex-1 min-w-[180px]" />
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(emptyForm); }}
          className="bg-navy text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-navy-dark transition">
          {showForm && !editing ? 'Cancelar' : 'Nuevo'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={guardar} className="bg-white rounded-lg border border-gray-100 p-5 mb-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-[11px] text-gray-400 uppercase tracking-wide mb-1">Nombre</label>
              <input required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:border-navy outline-none" />
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 uppercase tracking-wide mb-1">Categoria</label>
              <select value={form.categoria_id} onChange={e => setForm({ ...form, categoria_id: e.target.value })}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:border-navy outline-none">
                <option value="">Seleccionar</option>
                {categorias.map((c: any) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 uppercase tracking-wide mb-1">Marca</label>
              <input value={form.marca} onChange={e => setForm({ ...form, marca: e.target.value })}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:border-navy outline-none" />
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 uppercase tracking-wide mb-1">Referencia</label>
              <input value={form.referencia} onChange={e => setForm({ ...form, referencia: e.target.value })}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:border-navy outline-none" />
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 uppercase tracking-wide mb-1">Precio</label>
              <input type="number" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:border-navy outline-none" />
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 uppercase tracking-wide mb-1">Precio oferta</label>
              <input type="number" value={form.precio_oferta} onChange={e => setForm({ ...form, precio_oferta: e.target.value })}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:border-navy outline-none" />
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 uppercase tracking-wide mb-1">Stock</label>
              <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:border-navy outline-none" />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-[11px] text-gray-400 uppercase tracking-wide mb-1">Descripcion</label>
              <textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:border-navy outline-none" rows={3} />
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.destacado} onChange={e => setForm({ ...form, destacado: e.target.checked })}
                  className="rounded border-gray-300 text-navy focus:ring-navy" />
                <span className="text-sm text-gray-600">Producto destacado</span>
              </label>
            </div>
          </div>

          {/* Image manager */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Imagenes ({form.imagenes?.length || 0})</label>
              <label className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition ${uploading ? 'bg-gray-100 text-gray-400' : 'bg-navy/10 text-navy hover:bg-navy/20'}`}>
                {uploading ? 'Subiendo...' : 'Subir imagenes'}
                <input type="file" multiple accept="image/*" onChange={e => { if (e.target.files) { uploadFiles(e.target.files); e.target.value = ''; } }} className="hidden" disabled={uploading} />
              </label>
            </div>
            {form.imagenes && form.imagenes.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {form.imagenes.map((url: string, idx: number) => (
                  <div key={idx} draggable onDragStart={() => handleDragStart(idx)} onDragOver={e => handleDragOver(e, idx)} onDragEnd={handleDragEnd}
                    className={`relative group rounded-lg border-2 overflow-hidden aspect-square bg-gray-50 cursor-grab active:cursor-grabbing transition
                      ${idx === 0 ? 'border-solar' : 'border-gray-200'} ${dragIdx === idx ? 'opacity-50 scale-95' : ''}`}>
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-solar text-white text-[9px] font-bold px-1.5 py-0.5 rounded">PRINCIPAL</span>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                      <button type="button" onClick={() => moveImage(idx, idx - 1)} disabled={idx === 0}
                        className="w-7 h-7 rounded-full bg-white/90 text-gray-700 flex items-center justify-center text-xs disabled:opacity-30 hover:bg-white">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <button type="button" onClick={() => removeImage(idx)}
                        className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                      <button type="button" onClick={() => moveImage(idx, idx + 1)} disabled={idx === form.imagenes.length - 1}
                        className="w-7 h-7 rounded-full bg-white/90 text-gray-700 flex items-center justify-center text-xs disabled:opacity-30 hover:bg-white">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-navy/40 transition"
                onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('border-navy', 'bg-navy/5'); }}
                onDragLeave={e => { e.currentTarget.classList.remove('border-navy', 'bg-navy/5'); }}
                onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('border-navy', 'bg-navy/5'); if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files); }}>
                <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
                <p className="text-xs text-gray-400">Arrastra imagenes aqui o usa el boton &ldquo;Subir imagenes&rdquo;</p>
                <p className="text-[10px] text-gray-300 mt-1">La primera imagen sera la principal</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <button type="submit" className="bg-solar text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-solar-dark transition">{editing ? 'Actualizar producto' : 'Crear producto'}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); setForm(emptyForm); }}
              className="px-5 py-2 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100 transition">Cancelar</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 text-left text-[11px] text-gray-400 uppercase tracking-wide">
              <th className="py-2.5 px-3 w-10"></th>
              <th className="py-2.5 px-3">Producto</th>
              <th className="py-2.5 px-3 hidden md:table-cell">Marca</th>
              <th className="py-2.5 px-3">Precio</th>
              <th className="py-2.5 px-3">Stock</th>
              <th className="py-2.5 px-3 w-28">Acciones</th>
            </tr></thead>
            <tbody>
              {items.map((p: any) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-1.5 px-3">
                    {(p.imagen_url || p.imagenes?.[0]) ? (
                      <img src={p.imagenes?.[0] || p.imagen_url} alt="" className="w-9 h-9 rounded object-cover" />
                    ) : (
                      <div className="w-9 h-9 rounded bg-gray-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-3">
                    <span className="font-medium text-navy">{p.nombre}</span>
                    {p.destacado && <span className="ml-1.5 text-[9px] font-bold text-solar bg-solar/10 px-1 py-0.5 rounded">DEST</span>}
                  </td>
                  <td className="py-2 px-3 hidden md:table-cell text-gray-400">{p.marca || '-'}</td>
                  <td className="py-2 px-3 tabular-nums">{p.precio ? fmt(Number(p.precio)) : '-'}</td>
                  <td className="py-2 px-3">
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${Number(p.stock) === 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{p.stock ?? '-'}</span>
                  </td>
                  <td className="py-2 px-3">
                    <button onClick={() => editar(p)} className="text-navy hover:underline text-xs font-medium mr-2">Editar</button>
                    <button onClick={() => eliminar(p.id)} className="text-red-500 hover:underline text-xs font-medium">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {items.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No hay productos</p>}
        <div className="px-3"><Pagination page={page} total={total} perPage={perPage} onChange={setPage} /></div>
      </div>
    </div>
  );
}

// ─── Clientes Tab ───
function ClientesTab() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', empresa: '', ciudad: '' });
  const perPage = 25;

  const load = useCallback(() => {
    let url = `/api/clientes?limit=${perPage}&offset=${(page - 1) * perPage}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    fetch(url).then(r => r.json()).then(d => {
      if (Array.isArray(d)) { setItems(d); setTotal(d.length >= perPage ? page * perPage + 1 : (page - 1) * perPage + d.length); }
      else { setItems(d.rows || d); setTotal(d.total || d.length || 0); }
    });
  }, [search, page]);
  useEffect(() => { load(); }, [load]);

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/clientes', { method: 'POST', headers: authHeaders(), body: JSON.stringify(form) });
    setShowForm(false); setForm({ nombre: '', email: '', telefono: '', empresa: '', ciudad: '' }); load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Buscar clientes..."
          className="border border-gray-200 rounded-md px-3 py-2 text-sm flex-1 min-w-[180px]" />
        <button onClick={() => setShowForm(!showForm)} className="bg-navy text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-navy-dark transition ml-auto">
          {showForm ? 'Cancelar' : 'Nuevo'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={crear} className="bg-white rounded-lg border border-gray-100 p-4 mb-4 grid sm:grid-cols-2 gap-2.5">
          <input required placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="border border-gray-200 rounded-md px-3 py-2 text-sm" />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border border-gray-200 rounded-md px-3 py-2 text-sm" />
          <input placeholder="Telefono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} className="border border-gray-200 rounded-md px-3 py-2 text-sm" />
          <input placeholder="Empresa" value={form.empresa} onChange={e => setForm({ ...form, empresa: e.target.value })} className="border border-gray-200 rounded-md px-3 py-2 text-sm" />
          <input placeholder="Ciudad" value={form.ciudad} onChange={e => setForm({ ...form, ciudad: e.target.value })} className="border border-gray-200 rounded-md px-3 py-2 text-sm" />
          <button type="submit" className="bg-solar text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-solar-dark sm:col-span-2">Crear</button>
        </form>
      )}

      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 text-left text-[11px] text-gray-400 uppercase tracking-wide">
              <th className="py-2.5 px-3">Nombre</th>
              <th className="py-2.5 px-3 hidden md:table-cell">Email</th>
              <th className="py-2.5 px-3">Telefono</th>
              <th className="py-2.5 px-3 hidden md:table-cell">Empresa</th>
            </tr></thead>
            <tbody>
              {items.map((c: any) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-2 px-3 font-medium text-navy">{c.nombre}</td>
                  <td className="py-2 px-3 hidden md:table-cell text-gray-400">{c.email || '-'}</td>
                  <td className="py-2 px-3">{c.telefono || '-'}</td>
                  <td className="py-2 px-3 hidden md:table-cell">{c.empresa || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {items.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No hay clientes</p>}
        <div className="px-3"><Pagination page={page} total={total} perPage={perPage} onChange={setPage} /></div>
      </div>
    </div>
  );
}

// ─── Pedidos Tab ───
function PedidosTab() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const perPage = 25;

  useEffect(() => {
    fetch('/api/pedidos').then(r => r.json()).then(d => {
      if (Array.isArray(d)) { setItems(d); setTotal(d.length); }
      else { setItems(d.rows || d); setTotal(d.total || 0); }
    });
  }, []);

  const ec: Record<string, string> = {
    pendiente: 'bg-yellow-50 text-yellow-700', aprobado: 'bg-green-50 text-green-700',
    rechazado: 'bg-red-50 text-red-700', enviado: 'bg-blue-50 text-blue-700',
    entregado: 'bg-emerald-50 text-emerald-700', cancelado: 'bg-gray-100 text-gray-500',
  };

  const paginated = items.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100 text-left text-[11px] text-gray-400 uppercase tracking-wide">
            <th className="py-2.5 px-3">Referencia</th>
            <th className="py-2.5 px-3 hidden md:table-cell">Cliente</th>
            <th className="py-2.5 px-3">Total</th>
            <th className="py-2.5 px-3">Estado</th>
            <th className="py-2.5 px-3 hidden md:table-cell">Fecha</th>
          </tr></thead>
          <tbody>
            {paginated.map((p: any) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-2 px-3 font-mono text-xs text-navy">{p.referencia}</td>
                <td className="py-2 px-3 hidden md:table-cell">{p.cliente_nombre || '-'}</td>
                <td className="py-2 px-3 font-semibold tabular-nums">{fmt(Number(p.total))}</td>
                <td className="py-2 px-3"><span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${ec[p.estado] || ''}`}>{p.estado}</span></td>
                <td className="py-2 px-3 hidden md:table-cell text-gray-400 text-xs">{new Date(p.created_at).toLocaleDateString('es-CO')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {items.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No hay pedidos</p>}
      <div className="px-3"><Pagination page={page} total={items.length} perPage={perPage} onChange={setPage} /></div>
    </div>
  );
}

// ─── Usuarios Tab ───
function UsuariosTab({ currentUser }: { currentUser: User | null }) {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'asesor' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const perPage = 25;

  const loadUsers = useCallback(() => {
    fetch('/api/usuarios').then(r => r.json()).then(d => { setItems(d); setTotal(d.length); });
  }, []);
  useEffect(() => { loadUsers(); }, [loadUsers]);

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    let res;
    if (editing) {
      const payload: any = { nombre: form.nombre, email: form.email, rol: form.rol };
      if (form.password) payload.password = form.password;
      res = await fetch(`/api/usuarios/${editing.id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(payload) });
    } else {
      if (!form.password) { setError('La contrasena es obligatoria para usuarios nuevos'); return; }
      res = await fetch('/api/usuarios', { method: 'POST', headers: authHeaders(), body: JSON.stringify(form) });
    }
    if (res.ok) {
      setShowForm(false); setEditing(null); setForm({ nombre: '', email: '', password: '', rol: 'asesor' }); setShowPassword(false);
      loadUsers();
    } else {
      const data = await res.json();
      setError(data.error || 'Error al guardar');
    }
  }

  function editarUser(u: any) {
    setForm({ nombre: u.nombre, email: u.email, password: '', rol: u.rol });
    setEditing(u); setShowForm(true); setShowPassword(false); setError('');
  }

  const isSuperadmin = currentUser?.rol === 'superadmin';
  const paginated = items.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      {isSuperadmin && (
        <div className="flex justify-end mb-4">
          <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ nombre: '', email: '', password: '', rol: 'asesor' }); setShowPassword(false); setError(''); }}
            className="bg-navy text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-navy-dark transition">
            {showForm && !editing ? 'Cancelar' : 'Nuevo usuario'}
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={guardar} className="bg-white rounded-lg border border-gray-100 p-5 mb-4">
          <h4 className="text-sm font-semibold text-navy mb-3">{editing ? `Editando: ${editing.nombre}` : 'Nuevo usuario'}</h4>
          {error && <p className="text-xs text-red-500 mb-3 bg-red-50 px-3 py-2 rounded">{error}</p>}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-gray-400 uppercase tracking-wide mb-1">Nombre</label>
              <input required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:border-navy outline-none" />
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 uppercase tracking-wide mb-1">Email</label>
              <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:border-navy outline-none" />
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 uppercase tracking-wide mb-1">
                Contrasena {editing && <span className="normal-case text-gray-300">(dejar vacio para no cambiar)</span>}
              </label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={form.password} required={!editing}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 pr-10 text-sm focus:border-navy outline-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    {showPassword
                      ? <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      : <><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>
                    }
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 uppercase tracking-wide mb-1">Rol</label>
              <select value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:border-navy outline-none">
                <option value="asesor">Asesor</option>
                <option value="consulta">Consulta</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="bg-solar text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-solar-dark transition">
              {editing ? 'Actualizar' : 'Crear'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); setError(''); }}
              className="px-5 py-2 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100 transition">Cancelar</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 text-left text-[11px] text-gray-400 uppercase tracking-wide">
              <th className="py-2.5 px-3">Nombre</th>
              <th className="py-2.5 px-3">Email</th>
              <th className="py-2.5 px-3">Rol</th>
              <th className="py-2.5 px-3 hidden md:table-cell">Creado</th>
              {isSuperadmin && <th className="py-2.5 px-3 w-20">Acciones</th>}
            </tr></thead>
            <tbody>
              {paginated.map((u: any) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-2 px-3 font-medium text-navy">{u.nombre}</td>
                  <td className="py-2 px-3 text-gray-400">{u.email}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${u.rol === 'superadmin' ? 'bg-navy text-white' : u.rol === 'asesor' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>{u.rol}</span>
                  </td>
                  <td className="py-2 px-3 hidden md:table-cell text-gray-400 text-xs">{new Date(u.created_at).toLocaleDateString('es-CO')}</td>
                  {isSuperadmin && (
                    <td className="py-2 px-3">
                      {u.rol !== 'superadmin' ? (
                        <button onClick={() => editarUser(u)} className="text-navy hover:underline text-xs font-medium">Editar</button>
                      ) : (
                        <span className="text-[10px] text-gray-300">-</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-3"><Pagination page={page} total={total} perPage={perPage} onChange={setPage} /></div>
      </div>
    </div>
  );
}

// ─── Sidebar items ───
const sidebarItems: { key: Tab; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { key: 'negociaciones', label: 'Negociaciones', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { key: 'productos', label: 'Productos', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { key: 'clientes', label: 'Clientes', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { key: 'pedidos', label: 'Pedidos', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  { key: 'usuarios', label: 'Usuarios', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
];

// ─── Main Admin Page ───
export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-montserrat">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 h-14">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1.5">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d={sidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden lg:block p-1.5">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <img src="/logo-isolar.jpg" alt="iSolar" className="h-8 w-auto" />
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-xs text-gray-400 hover:text-navy transition hidden sm:inline">Ver sitio web</a>
            <span className="text-xs text-gray-400 hidden sm:inline">{user.nombre}</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${user.rol === 'superadmin' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-500'}`}>{user.rol}</span>
            <button onClick={logout} className="text-xs text-gray-400 hover:text-red-500 transition">Salir</button>
          </div>
        </div>
      </header>

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-14 bottom-0 left-0 z-30 bg-white border-r border-gray-200 transition-all duration-200
        ${sidebarOpen ? 'translate-x-0 w-56' : '-translate-x-full w-56'}
        lg:translate-x-0 ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-56'}`}>
        <nav className="p-3 space-y-0.5">
          {sidebarItems.map(item => (
            <button key={item.key} onClick={() => { setTab(item.key); setSidebarOpen(false); }}
              title={sidebarCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-2.5 rounded-md text-sm font-medium transition
                ${sidebarCollapsed ? 'lg:justify-center lg:px-0 px-3' : 'px-3'} py-2
                ${tab === item.key ? 'bg-navy text-white' : 'text-gray-500 hover:text-navy hover:bg-gray-50'}`}>
              <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              <span className={sidebarCollapsed ? 'lg:hidden' : ''}>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-100">
          <a href="/" target="_blank" title={sidebarCollapsed ? 'Ver sitio web' : undefined}
            className={`flex items-center gap-2 py-2 rounded-md text-sm text-gray-400 hover:text-navy hover:bg-gray-50 transition
              ${sidebarCollapsed ? 'lg:justify-center lg:px-0 px-3' : 'px-3'}`}>
            <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            <span className={sidebarCollapsed ? 'lg:hidden' : ''}>Ver sitio web</span>
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className={`pt-14 transition-all duration-200 ${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-56'}`}>
        <div className="p-4 lg:p-6 max-w-[1200px]">
          <h2 className="text-lg font-bold text-navy mb-4">
            {sidebarItems.find(i => i.key === tab)?.label}
          </h2>
          {tab === 'dashboard' && <DashboardTab />}
          {tab === 'negociaciones' && <NegociacionesTab />}
          {tab === 'productos' && <ProductosTab />}
          {tab === 'clientes' && <ClientesTab />}
          {tab === 'pedidos' && <PedidosTab />}
          {tab === 'usuarios' && <UsuariosTab currentUser={user} />}
        </div>
      </main>
    </div>
  );
}
