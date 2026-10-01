import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const [productos, negociaciones, ventasMes, pipeline, fuentes, pedidos] = await Promise.all([
      query(`SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE activo = true) as activos,
        COUNT(*) FILTER (WHERE stock > 0 AND activo = true) as con_stock,
        COUNT(*) FILTER (WHERE stock = 0 AND activo = true) as sin_stock
      FROM productos`),

      query(`SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE estado = 'lead') as leads,
        COUNT(*) FILTER (WHERE estado = 'contactado') as contactados,
        COUNT(*) FILTER (WHERE estado = 'cotizado') as cotizados,
        COUNT(*) FILTER (WHERE estado = 'negociacion') as en_negociacion,
        COUNT(*) FILTER (WHERE estado = 'cerrado') as cerrados,
        COUNT(*) FILTER (WHERE estado = 'perdido') as perdidos
      FROM negociaciones`),

      query(`SELECT COALESCE(SUM(valor_cierre),0) as total_ventas, COUNT(*) as num_ventas
        FROM negociaciones
        WHERE estado='cerrado' AND date_trunc('month', updated_at) = date_trunc('month', CURRENT_DATE)`),

      query(`SELECT estado, COUNT(*) as count FROM negociaciones WHERE estado NOT IN ('cerrado','perdido') GROUP BY estado ORDER BY count DESC`),

      query(`SELECT fuente, COUNT(*) as count FROM negociaciones GROUP BY fuente ORDER BY count DESC`),

      query(`SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE estado = 'aprobado') as aprobados,
        COUNT(*) FILTER (WHERE estado = 'pendiente') as pendientes,
        COALESCE(SUM(total) FILTER (WHERE estado = 'aprobado'),0) as ingresos
      FROM pedidos WHERE date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE)`),
    ]);

    return NextResponse.json({
      productos: productos.rows[0],
      negociaciones: negociaciones.rows[0],
      ventasMes: ventasMes.rows[0],
      pipeline: pipeline.rows,
      fuentes: fuentes.rows,
      pedidos: pedidos.rows[0],
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
