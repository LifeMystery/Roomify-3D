import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { put } from '@vercel/blob';

const MAX_BYTES = 10 * 1024 * 1024;
const MAX_MODEL_BYTES = 20 * 1024 * 1024;
const ALLOWED_TYPES = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };

// Production: Vercel Blob (set BLOB_READ_WRITE_TOKEN). Local dev: public/uploads,
// which only works under `next dev` — files written at runtime are not served by `next start`.
async function store(filename, buffer, contentType) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`items/${filename}`, buffer, { access: 'public', contentType });
    return blob.url;
  }
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), buffer);
  return `/uploads/${filename}`;
}

function toCm(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 && n < 1000 ? n : null;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('product');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }
    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      return NextResponse.json({ success: false, message: 'Use a JPG, PNG or WebP photo' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ success: false, message: 'Photo must be under 10 MB' }, { status: 400 });
    }

    const model = formData.get('model');
    if (!model || typeof model === 'string') {
      return NextResponse.json({ success: false, message: 'No 3D model uploaded' }, { status: 400 });
    }
    if (model.size > MAX_MODEL_BYTES) {
      return NextResponse.json({ success: false, message: '3D model must be under 20 MB' }, { status: 400 });
    }
    const modelBuffer = Buffer.from(await model.arrayBuffer());
    if (modelBuffer.subarray(0, 4).toString('ascii') !== 'glTF') {
      return NextResponse.json({ success: false, message: '3D model must be a GLB file' }, { status: 400 });
    }

    const widthCm = toCm(formData.get('widthCm'));
    const heightCm = toCm(formData.get('heightCm'));
    const depthCm = toCm(formData.get('depthCm'));
    if (!widthCm || !heightCm || !depthCm) {
      return NextResponse.json({ success: false, message: 'Width, height and depth are required' }, { status: 400 });
    }

    const id = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    const imageUrl = await store(`${id}${ext}`, Buffer.from(await file.arrayBuffer()), file.type);
    const modelUrl = await store(`${id}.glb`, modelBuffer, 'model/gltf-binary');

    return NextResponse.json({
      success: true,
      item: {
        name: String(formData.get('name') || '').slice(0, 120),
        imageUrl,
        modelUrl,
        widthCm,
        heightCm,
        depthCm,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
