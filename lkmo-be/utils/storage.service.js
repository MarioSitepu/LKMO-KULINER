import crypto from 'crypto';
import path from 'path';

import { supabase, getSupabaseBucket, getSupabaseUrl, isSupabaseConfigured } from './supabaseClient.js';

const buildPublicBaseUrl = () => {
  const supabaseUrl = getSupabaseUrl();
  const bucket = getSupabaseBucket();
  if (!supabaseUrl || !bucket) return null;
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/`;
};

const normalizeExtension = (originalName = '') => {
  const ext = path.extname(originalName).toLowerCase();
  if (ext) return ext;
  return '.jpg';
};

const sanitizeFolder = (folder = '') => folder.replace(/\\+/g, '/').replace(/\s+/g, '-').replace(/[^a-zA-Z0-9_\-/]/g, '');

const buildStoragePath = ({ folder = 'uploads', userId }) => {
  const safeFolder = sanitizeFolder(folder || 'uploads');
  const parts = [safeFolder];
  if (userId) {
    parts.push(String(userId));
  }
  const randomSuffix = crypto.randomBytes(6).toString('hex');
  const timestamp = Date.now();
  return `${parts.join('/')}/${timestamp}-${randomSuffix}`;
};

export const uploadImageToSupabase = async (file, { folder = 'uploads', userId } = {}) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase belum dikonfigurasi. Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, dan SUPABASE_BUCKET.');
  }

  if (!file || !file.buffer) {
    throw new Error('Buffer file tidak ditemukan. Pastikan multer menggunakan memoryStorage.');
  }

  const bucket = getSupabaseBucket();
  const objectKeyBase = buildStoragePath({ folder, userId });
  const extension = normalizeExtension(file.originalname);
  const objectKey = `${objectKeyBase}${extension}`;

  const { error } = await supabase.storage.from(bucket).upload(objectKey, file.buffer, {
    contentType: file.mimetype || 'application/octet-stream',
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    throw new Error(`Gagal mengupload gambar ke Supabase: ${error.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectKey);

  if (!data?.publicUrl) {
    throw new Error('Gagal mendapatkan URL publik dari Supabase.');
  }

  return {
    path: objectKey,
    publicUrl: data.publicUrl,
  };
};

export const deleteImageFromSupabase = async (urlOrPath) => {
  if (!isSupabaseConfigured() || !urlOrPath) {
    return;
  }

  let storagePath = urlOrPath;
  const publicBaseUrl = buildPublicBaseUrl();

  if (typeof urlOrPath === 'string' && urlOrPath.startsWith('http') && publicBaseUrl && urlOrPath.startsWith(publicBaseUrl)) {
    storagePath = urlOrPath.substring(publicBaseUrl.length);
  }

  if (!storagePath || storagePath.startsWith('http')) {
    return;
  }

  const bucket = getSupabaseBucket();
  await supabase.storage.from(bucket).remove([storagePath]);
};

export const isSupabasePublicUrl = (url) => {
  if (!url) return false;
  const publicBaseUrl = buildPublicBaseUrl();
  if (!publicBaseUrl) return false;
  return url.startsWith(publicBaseUrl);
};

export const isLegacyLocalPath = (value) => typeof value === 'string' && value.startsWith('/uploads/');

export const deleteLegacyLocalFile = async (relativePath) => {
  if (!isLegacyLocalPath(relativePath)) {
    return;
  }

  try {
    const fs = await import('fs');
    const absolutePath = path.join(process.cwd(), relativePath);
    await fs.promises.unlink(absolutePath);
  } catch (error) {
    // Abaikan error, karena file mungkin sudah tidak ada (contoh: Render free tier)
  }
};

