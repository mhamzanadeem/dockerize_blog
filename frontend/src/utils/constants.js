const envApi = import.meta.env.VITE_API_URL;
const envBackend = import.meta.env.VITE_BACKEND_URL;
const host = typeof window !== 'undefined' ? window.location.hostname : '';
export const API_BASE_URL = host === 'localhost'
  ? 'http://localhost:8000/api'
  : (envApi || 'https://blog-api-latest-ltrs.onrender.com/api');
export const BACKEND_URL = host === 'localhost'
  ? 'http://localhost:8000'
  : (envBackend || 'https://blog-api-latest-ltrs.onrender.com');
export const PLACEHOLDER_AVATAR = 'https://ui-avatars.com/api/?background=001f3f&color=fed65b&bold=true';
export const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80';
export const DEFAULT_COVER_IMAGES = [
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
];
export const CATEGORIES = ['Technology', 'Design', 'Business', 'Culture', 'Science', 'Productivity', 'Health', 'Travel'];
