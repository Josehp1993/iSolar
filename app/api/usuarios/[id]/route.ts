import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { nombre, email, password, rol } = body;

    const existing = await query('SELECT rol FROM usuarios WHERE id = $1', [id]);
    if (existing.rows.length === 0) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    if (existing.rows[0].rol === 'superadmin') return NextResponse.json({ error: 'No se puede editar un superadmin' }, { status: 403 });

    if (password) {
      const hash = await hashPassword(password);
      const result = await query(
        'UPDATE usuarios SET nombre=$1, email=$2, password_hash=$3, rol=$4, updated_at=CURRENT_TIMESTAMP WHERE id=$5 RETURNING id, nombre, email, rol',
        [nombre, email, hash, rol, id]
      );
      return NextResponse.json(result.rows[0]);
    } else {
      const result = await query(
        'UPDATE usuarios SET nombre=$1, email=$2, rol=$3, updated_at=CURRENT_TIMESTAMP WHERE id=$4 RETURNING id, nombre, email, rol',
        [nombre, email, rol, id]
      );
      return NextResponse.json(result.rows[0]);
    }
  } catch (error: any) {
    if (error.code === '23505') return NextResponse.json({ error: 'Email ya registrado' }, { status: 409 });
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existing = await query('SELECT rol FROM usuarios WHERE id = $1', [id]);
    if (existing.rows.length === 0) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    if (existing.rows[0].rol === 'superadmin') return NextResponse.json({ error: 'No se puede eliminar un superadmin' }, { status: 403 });
    await query('UPDATE usuarios SET activo = false WHERE id = $1', [id]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
