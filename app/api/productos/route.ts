import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoria = searchParams.get('categoria');
    const busqueda = searchParams.get('q');

    let sql = `SELECT p.*, c.nombre as categoria_nombre, c.slug as categoria_slug
      FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.activo = true`;
    const params: any[] = [];

    if (categoria) {
      params.push(categoria);
      sql += ` AND c.slug = $${params.length}`;
    }
    if (busqueda) {
      params.push(`%${busqueda}%`);
      sql += ` AND (p.nombre ILIKE $${params.length} OR p.marca ILIKE $${params.length})`;
    }

    sql += ' ORDER BY p.destacado DESC, p.created_at DESC';

    const result = await query(sql, params);
    const rows = result.rows.map((r: any) => ({
      ...r,
      precio: Number(r.precio),
      precio_oferta: r.precio_oferta != null ? Number(r.precio_oferta) : null,
      stock: Number(r.stock),
    }));
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, precio_oferta, stock, imagen_url, imagenes, destacado } = body;

    const result = await query(
      `INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, precio, precio_oferta, stock, imagen_url, imagenes, destacado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
      [categoria_id, nombre, slug, marca, referencia, descripcion, JSON.stringify(specs || {}), features || [], precio || 0, precio_oferta, stock || 0, imagen_url, imagenes || [], destacado || false]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
