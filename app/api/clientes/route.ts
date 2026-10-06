import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');

    let sql = 'SELECT * FROM clientes';
    const params: any[] = [];

    if (q) {
      params.push(`%${q}%`);
      sql += ` WHERE nombre ILIKE $1 OR telefono ILIKE $1 OR cedula ILIKE $1 OR email ILIKE $1`;
    }
    sql += ' ORDER BY created_at DESC LIMIT 100';

    const result = await query(sql, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { nombre, email, telefono, cedula, ciudad, direccion, notas } = await req.json();
    const result = await query(
      `INSERT INTO clientes (nombre, email, telefono, cedula, ciudad, direccion, notas)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (cedula) DO UPDATE SET
         nombre = EXCLUDED.nombre, email = EXCLUDED.email, telefono = EXCLUDED.telefono,
         ciudad = EXCLUDED.ciudad, direccion = EXCLUDED.direccion, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [nombre, email, telefono, cedula, ciudad, direccion, notas]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
