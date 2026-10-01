import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT id, nombre, slug, descripcion FROM categorias WHERE activa = true ORDER BY orden');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
