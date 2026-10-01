import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function GET() {
  try {
    const result = await query('SELECT id, nombre, email, rol, activo, created_at FROM usuarios ORDER BY created_at DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { nombre, email, password, rol } = await req.json();
    if (!nombre || !email || !password) {
      return NextResponse.json({ error: 'Nombre, email y password requeridos' }, { status: 400 });
    }
    const hash = await hashPassword(password);
    const result = await query(
      'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES ($1,$2,$3,$4) RETURNING id, nombre, email, rol',
      [nombre, email, hash, rol || 'asesor']
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    if (error.code === '23505') return NextResponse.json({ error: 'Email ya registrado' }, { status: 409 });
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
