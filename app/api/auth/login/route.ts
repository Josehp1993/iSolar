import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email y password requeridos' }, { status: 400 });
    }

    const result = await query('SELECT * FROM usuarios WHERE email = $1 AND activo = true', [email]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Credenciales invalidas' }, { status: 401 });
    }

    const user = result.rows[0];
    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Credenciales invalidas' }, { status: 401 });
    }

    const token = generateToken({ id: user.id, email: user.email, rol: user.rol, nombre: user.nombre });

    return NextResponse.json({
      token,
      user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
