import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { cliente_id, referencia, subtotal, iva, total, direccion_envio, notas, items } = await req.json();
    if (!referencia || !items?.length) {
      return NextResponse.json({ error: 'Referencia e items requeridos' }, { status: 400 });
    }

    const pedido = await query(
      `INSERT INTO pedidos (cliente_id, referencia, subtotal, iva, total, direccion_envio, notas)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [cliente_id, referencia, subtotal, iva, total, direccion_envio, notas]
    );

    for (const item of items) {
      const sub = item.precio_unitario * item.cantidad;
      await query(
        `INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
         VALUES ($1,$2,$3,$4,$5)`,
        [pedido.rows[0].id, item.producto_id, item.cantidad, item.precio_unitario, sub]
      );
    }

    return NextResponse.json(pedido.rows[0], { status: 201 });
  } catch (error: any) {
    if (error.code === '23505') return NextResponse.json({ error: 'Referencia duplicada' }, { status: 409 });
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const ref = new URL(req.url).searchParams.get('ref');
    if (ref) {
      const result = await query(
        `SELECT p.*, c.nombre as cliente_nombre, c.email as cliente_email
         FROM pedidos p LEFT JOIN clientes c ON p.cliente_id = c.id
         WHERE p.referencia = $1`, [ref]);
      if (result.rows.length === 0) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
      const items = await query(
        `SELECT pi.*, pr.nombre as producto_nombre FROM pedido_items pi
         JOIN productos pr ON pi.producto_id = pr.id WHERE pi.pedido_id = $1`, [result.rows[0].id]);
      return NextResponse.json({ ...result.rows[0], items: items.rows });
    }
    const result = await query(
      `SELECT p.*, c.nombre as cliente_nombre FROM pedidos p
       LEFT JOIN clientes c ON p.cliente_id = c.id ORDER BY p.created_at DESC LIMIT 100`);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
