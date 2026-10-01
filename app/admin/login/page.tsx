'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Error'); return; }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/admin');
    } catch { setError('Error de conexion'); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-montserrat font-bold text-navy text-center mb-6">iSolar Admin</h1>
        {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}
        <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-3 focus:ring-2 focus:ring-navy focus:outline-none" />
        <input type="password" placeholder="Contrasena" required value={password} onChange={e => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-4 focus:ring-2 focus:ring-navy focus:outline-none" />
        <button type="submit" disabled={loading}
          className="w-full bg-navy text-white font-semibold py-2.5 rounded-lg hover:bg-navy-dark disabled:opacity-50 transition">
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
