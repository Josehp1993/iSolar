import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { reference, amountInCents, currency } = await req.json();
    const integritySecret = process.env.WOMPI_INTEGRITY_KEY;

    if (!integritySecret) {
      return NextResponse.json({ error: 'Wompi integrity key not configured' }, { status: 500 });
    }

    const concat = `${reference}${amountInCents}${currency}${integritySecret}`;
    const hash = crypto.createHash('sha256').update(concat).digest('hex');

    return NextResponse.json({ hash });
  } catch (error) {
    console.error('Integrity hash error:', error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
