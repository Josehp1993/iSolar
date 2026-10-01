import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET = process.env.R2_BUCKET || 'isolar-media';
const PUBLIC_URL = process.env.R2_PUBLIC_URL || '';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    if (files.length === 0) return NextResponse.json({ error: 'No files' }, { status: 400 });

    const urls: string[] = [];
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = (file.name.match(/\.\w+$/) || ['.jpg'])[0];
      const key = `productos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

      await R2.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type || 'image/jpeg',
      }));

      urls.push(`${PUBLIC_URL}/${key}`);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('R2 upload error:', error);
    return NextResponse.json({ error: 'Error al subir archivos' }, { status: 500 });
  }
}
