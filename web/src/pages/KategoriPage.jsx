import { useKategori } from '../hooks/useKategori';
import KategoriGrid from '../components/kategori/KategoriGrid';

const KategoriPage = () => {
    const { kategori, loading, error } = useKategori();

    return (
        <div className="page-transition">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Kategori Berita</h1>
                <p className="text-gray-600">
                    Pilih kategori untuk melihat berita yang sesuai dengan minat Anda
                </p>
            </div>

            <KategoriGrid kategori={kategori} loading={loading} error={error} />
        </div>
    );
};

export default KategoriPage;
