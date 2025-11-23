export const API_BASE_URL = 'http://localhost:3000/api';

export const ROUTES = {
    HOME: '/',
    BERITA: '/berita',
    BERITA_DETAIL: '/berita/:id',
    KATEGORI: '/kategori',
    KATEGORI_DETAIL: '/kategori/:slug',
    BOOKMARK: '/bookmark',
    PROFIL: '/profil',
};

export const ITEMS_PER_PAGE = 9;

export const SORT_OPTIONS = [
    { value: 'newest', label: 'Terbaru' },
    { value: 'oldest', label: 'Terlama' },
    { value: 'popular', label: 'Populer' },
];

export const STATUS_OPTIONS = [
    { value: 'all', label: 'Semua Status' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
];
