import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

interface RawProduct {
  id: string;
  category: string;
  subcategory?: string;
  name: string;
  brand: string;
  specs: Record<string, string>;
  features: string[];
  reference: string;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function seed() {
  const raw: RawProduct[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../isolar/data/products.json'), 'utf-8'));
  const catRows = await pool.query('SELECT id, slug FROM categorias');
  const catMap = Object.fromEntries(catRows.rows.map(r => [r.slug, r.id]));

  let inserted = 0;
  for (const p of raw) {
    const categoriaId = catMap[p.category];
    if (!categoriaId) { console.log(`Categoria no encontrada: ${p.category}`); continue; }
    const slug = slugify(p.name);
    const desc = p.subcategory ? `${p.subcategory} - ${p.brand}` : p.brand;
    await pool.query(
      `INSERT INTO productos (categoria_id, nombre, slug, marca, referencia, descripcion, specs, features, stock, activo)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,10,true)
       ON CONFLICT (slug) DO NOTHING`,
      [categoriaId, p.name, slug, p.brand, p.reference, desc, JSON.stringify(p.specs), p.features]
    );
    inserted++;
  }
  console.log(`${inserted} productos procesados de ${raw.length} total`);
  await pool.end();
}

seed().catch(e => { console.error(e); process.exit(1); });
