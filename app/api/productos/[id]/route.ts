import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await query(
      `SELECT p.*, c.nombre as categoria_nombre, c.slug as categoria_slug
       FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id WHERE p.id = $1`,
      [id]
    );
    if (result.rows.length === 0) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, precio_oferta, stock, imagen_url, imagenes, activo, destacado } = body;

    const result = await query(
      `UPDATE productos SET categoria_id=$1, nombre=$2, slug=$3, marca=$4, referencia=$5, descripcion=$6, specs=$7, features=$8, precio=$9, precio_oferta=$10, stock=$11, imagen_url=$12, imagenes=$13, activo=$14, destacado=$15, updated_at=CURRENT_TIMESTAMP
       WHERE id=$16 RETURNING *`,
      [categoria_id, nombre, slug, marca, referencia, descripcion, JSON.stringify(specs || {}), features || [], precio, precio_oferta, stock, imagen_url, imagenes || [], activo ?? true, destacado ?? false, id]
    );
    if (result.rows.length === 0) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await query('UPDATE productos SET activo = false WHERE id = $1', [id]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
