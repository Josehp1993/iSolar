import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const negociacion_id = searchParams.get('negociacion_id');
    if (!negociacion_id) return NextResponse.json({ error: 'negociacion_id requerido' }, { status: 400 });

    const result = await query('SELECT * FROM seguimientos WHERE negociacion_id = $1 ORDER BY created_at DESC', [negociacion_id]);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { negociacion_id, tipo, mensaje } = await req.json();
    const result = await query(
      `INSERT INTO seguimientos (negociacion_id, tipo, mensaje) VALUES ($1,$2,$3) RETURNING *`,
      [negociacion_id, tipo || 'nota', mensaje]
    );
    await query('UPDATE negociaciones SET updated_at=CURRENT_TIMESTAMP WHERE id=$1', [negociacion_id]);
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
