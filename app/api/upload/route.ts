import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

function getR2Client() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export async function POST(req: NextRequest) {
  try {
    const client = getR2Client();
    if (!client) {
      return NextResponse.json({ error: 'Almacenamiento no configurado (variables R2 faltantes)' }, { status: 500 });
    }

    const bucket = process.env.R2_BUCKET || 'isolar-media';
    const publicUrl = process.env.R2_PUBLIC_URL || '';

    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    if (files.length === 0) return NextResponse.json({ error: 'No files' }, { status: 400 });

    const urls: string[] = [];
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = (file.name.match(/\.\w+$/) || ['.jpg'])[0];
      const key = `productos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

      await client.send(new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type || 'image/jpeg',
      }));

      urls.push(`${publicUrl}/${key}`);
    }

    return NextResponse.json({ urls });
  } catch (error: any) {
    console.error('R2 upload error:', error);
    return NextResponse.json({ error: `Error al subir: ${error.message || 'desconocido'}` }, { status: 500 });
  }
}
