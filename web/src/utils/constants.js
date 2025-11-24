export const API_BASE_URL = 'https://news-api-sepia-delta.vercel.app';

export const ROUTES = {
    HOME: '/',
    BERITA: '/berita',
    BERITA_DETAIL: '/berita/:id',
    KATEGORI: '/kategori',
    KATEGORI_DETAIL: '/kategori/:slug',
    BOOKMARK: '/bookmark',
    PROFIL: '/profil',
    LOGIN: '/login',
    REGISTER: '/register',
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_BERITA: '/admin/berita',
    ADMIN_BERITA_CREATE: '/admin/berita/create',
    ADMIN_BERITA_EDIT: '/admin/berita/edit/:id',
};

export const ITEMS_PER_PAGE = 9;

export const SORT_OPTIONS = [
    { value: 'newest', label: 'Terbaru' },
    { value: 'oldest', label: 'Terlama' },
    { value: 'popular', label: 'Terpopuler' }
];

export const STATUS_OPTIONS = [
    { value: 'all', label: 'Semua Status' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
];
