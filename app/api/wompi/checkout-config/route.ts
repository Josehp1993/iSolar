import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { reference, amountInCents, currency } = await req.json();
    const integritySecret = process.env.WOMPI_INTEGRITY_KEY;
    const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;

    if (!integritySecret || !publicKey) {
      return NextResponse.json({ error: 'Wompi no configurado' }, { status: 500 });
    }

    const concat = `${reference}${amountInCents}${currency}${integritySecret}`;
    const hash = crypto.createHash('sha256').update(concat).digest('hex');

    return NextResponse.json({ publicKey, hash });
  } catch (error) {
    console.error('Checkout config error:', error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
