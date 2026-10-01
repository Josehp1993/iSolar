import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { estado, valor_cotizacion, valor_cierre, descripcion, usuario_id } = await req.json();

    const result = await query(
      `UPDATE negociaciones SET estado=COALESCE($1,estado), valor_cotizacion=COALESCE($2,valor_cotizacion),
       valor_cierre=COALESCE($3,valor_cierre), descripcion=COALESCE($4,descripcion),
       usuario_id=COALESCE($5,usuario_id), updated_at=CURRENT_TIMESTAMP
       WHERE id=$6 RETURNING *`,
      [estado, valor_cotizacion, valor_cierre, descripcion, usuario_id, id]
    );
    if (result.rows.length === 0) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
