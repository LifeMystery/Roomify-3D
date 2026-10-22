import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

const MAX_TEXTURE = 1024;

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}

// Cut the measured item box out of a photo, capped at MAX_TEXTURE px to keep the model small.
export async function cropToCanvas(file, rect) {
  const img = await loadImage(file);
  const scale = Math.min(1, MAX_TEXTURE / Math.max(rect.w, rect.h));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(rect.w * scale));
  canvas.height = Math.max(1, Math.round(rect.h * scale));
  canvas.getContext('2d').drawImage(img, rect.x, rect.y, rect.w, rect.h, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function mirrored(canvas) {
  const out = document.createElement('canvas');
  out.width = canvas.width;
  out.height = canvas.height;
  const ctx = out.getContext('2d');
  ctx.scale(-1, 1);
  ctx.drawImage(canvas, -canvas.width, 0);
  return out;
}

// Average colour of the top strip of the front view, used for the lid when there is no top photo.
function topColour(canvas) {
  const rows = Math.max(1, Math.round(canvas.height * 0.05));
  const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, rows);
  let r = 0, g = 0, b = 0;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  const n = data.length / 4;
  return new THREE.Color(`rgb(${Math.round(r / n)}, ${Math.round(g / n)}, ${Math.round(b / n)})`);
}

function faceMaterial(source) {
  if (source instanceof THREE.Color) {
    return new THREE.MeshStandardMaterial({ color: source, roughness: 1, metalness: 0 });
  }
  const texture = new THREE.CanvasTexture(source);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.userData.mimeType = 'image/jpeg';
  return new THREE.MeshStandardMaterial({ map: texture, roughness: 1, metalness: 0 });
}

// A true-size box with the seller's photos on its faces, exported as GLB (metres, floor at y = 0).
// Expects: front = front view, side = right-hand side view (front edge on the left of the photo),
// top = view from above with the front at the bottom of the photo (optional).
export async function buildBoxModel({ widthCm, heightCm, depthCm, front, side, top }) {
  const geometry = new THREE.BoxGeometry(widthCm / 100, heightCm / 100, depthCm / 100);
  geometry.translate(0, heightCm / 200, 0);

  // BoxGeometry face order: +x, -x, +y, -y, +z, -z
  const materials = [
    faceMaterial(side),
    faceMaterial(mirrored(side)),
    faceMaterial(top || topColour(front)),
    faceMaterial(new THREE.Color('#3f3f46')),
    faceMaterial(front),
    faceMaterial(mirrored(front)),
  ];

  const scene = new THREE.Scene();
  scene.add(new THREE.Mesh(geometry, materials));

  const glb = await new GLTFExporter().parseAsync(scene, { binary: true });
  return new Blob([glb], { type: 'model/gltf-binary' });
}

export function canvasToBlob(canvas, type = 'image/jpeg', quality = 0.9) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}
