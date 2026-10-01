import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, data } = body;

    if (event !== 'transaction.updated') {
      return NextResponse.json({ ok: true });
    }

    const transaction = data?.transaction;
    if (!transaction) return NextResponse.json({ error: 'No transaction' }, { status: 400 });

    const { id: txId, status, reference, amount_in_cents } = transaction;

    const eventsKey = process.env.WOMPI_EVENTS_KEY;
    if (eventsKey) {
      const checksum = body.signature?.checksum;
      const properties = body.signature?.properties || [];
      const values = properties.map((prop: string) => {
        const parts = prop.split('.');
        let val: any = data;
        for (const p of parts) val = val?.[p];
        return val;
      });
      const concat = values.join('') + body.timestamp + eventsKey;
      const hash = crypto.createHash('sha256').update(concat).digest('hex');
      if (hash !== checksum) {
        console.error('Wompi webhook: checksum invalido');
        return NextResponse.json({ error: 'Checksum invalido' }, { status: 401 });
      }
    }

    const estadoMap: Record<string, string> = {
      APPROVED: 'aprobado',
      DECLINED: 'rechazado',
      VOIDED: 'cancelado',
      ERROR: 'rechazado',
    };

    const estadoPedido = estadoMap[status] || 'pendiente';

    await query(
      `UPDATE pedidos SET wompi_transaction_id = $1, wompi_status = $2, estado = $3, updated_at = CURRENT_TIMESTAMP
       WHERE referencia = $4`,
      [txId, status, estadoPedido, reference]
    );

    if (estadoPedido === 'aprobado') {
      const pedido = await query('SELECT id FROM pedidos WHERE referencia = $1', [reference]);
      if (pedido.rows.length > 0) {
        const items = await query('SELECT producto_id, cantidad FROM pedido_items WHERE pedido_id = $1', [pedido.rows[0].id]);
        for (const item of items.rows) {
          await query('UPDATE productos SET stock = stock - $1 WHERE id = $2 AND stock >= $1', [item.cantidad, item.producto_id]);
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Wompi webhook error:', error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
