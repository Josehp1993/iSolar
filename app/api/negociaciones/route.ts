import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const estado = searchParams.get('estado');

    let sql = `SELECT n.*, c.nombre as cliente_nombre, c.telefono as cliente_telefono, c.email as cliente_email,
      p.nombre as producto_nombre, u.nombre as asesor_nombre
      FROM negociaciones n
      LEFT JOIN clientes c ON n.cliente_id = c.id
      LEFT JOIN productos p ON n.producto_id = p.id
      LEFT JOIN usuarios u ON n.usuario_id = u.id`;
    const params: any[] = [];

    if (estado) {
      params.push(estado);
      sql += ` WHERE n.estado = $1`;
    }
    sql += ' ORDER BY n.updated_at DESC';

    const result = await query(sql, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { cliente_id, producto_id, usuario_id, estado, fuente, valor_cotizacion, descripcion } = await req.json();
    const result = await query(
      `INSERT INTO negociaciones (cliente_id, producto_id, usuario_id, estado, fuente, valor_cotizacion, descripcion)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [cliente_id, producto_id, usuario_id, estado || 'lead', fuente || 'web', valor_cotizacion || 0, descripcion]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
