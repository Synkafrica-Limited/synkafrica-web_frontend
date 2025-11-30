// lib/cloudinary.js
// Simple Cloudinary helper for direct uploads (unsigned preset)
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

export async function uploadFileToCloudinary(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary not configured (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or UPLOAD_PRESET missing)');
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(url, { method: 'POST', body: fd });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Cloudinary upload failed: ${res.status} ${body}`);
  }
  const data = await res.json();
  return data.secure_url || data.url;
}

export async function uploadFiles(files = []) {
  const results = [];
  for (const f of files) {
    const url = await uploadFileToCloudinary(f);
    results.push(url);
  }
  return results;
}

export default { uploadFileToCloudinary, uploadFiles };
