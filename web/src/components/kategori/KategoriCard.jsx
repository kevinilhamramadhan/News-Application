import { Folder } from 'lucide-react';

const KategoriCard = ({ kategori }) => {
    const handleClick = () => {
        window.location.hash = `/kategori/${kategori.slug}`;
    };

    return (
        <div
            onClick={handleClick}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group text-center"
        >
            <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    <Folder className="w-8 h-8 text-primary-600" />
                </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                {kategori.nama}
            </h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {kategori.deskripsi || 'Kategori berita'}
            </p>
            <div className="text-xs text-gray-500">
                {kategori.jumlah_berita || kategori._count?.berita || 0} berita
            </div>
        </div>
    );
};

export default KategoriCard;
