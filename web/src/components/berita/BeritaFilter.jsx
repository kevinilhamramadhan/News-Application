import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { debounce } from '../../utils/helpers';
import { SORT_OPTIONS } from '../../utils/constants';

const BeritaFilter = ({ onFilterChange, kategoriList = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedKategori, setSelectedKategori] = useState('');
    const [selectedSort, setSelectedSort] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);

    // Debounced search
    useEffect(() => {
        const debouncedSearch = debounce(() => {
            onFilterChange({
                search: searchTerm,
                kategori_id: selectedKategori,  // Changed from 'kategori' to 'kategori_id'
                sort: selectedSort,
            });
        }, 500);

        debouncedSearch();
    }, [searchTerm, selectedKategori, selectedSort]);

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Cari berita..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>

                {/* Filter Toggle (Mobile) */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                    <Filter className="w-5 h-5" />
                    <span>Filter</span>
                </button>
            </div>

            {/* Filter Options */}
            <div className={`${showFilters ? 'block' : 'hidden'} md:flex gap-4 mt-4`}>
                {/* Category Filter */}
                <select
                    value={selectedKategori}
                    onChange={(e) => setSelectedKategori(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                    <option value="">Semua Kategori</option>
                    {kategoriList.map((kat) => (
                        <option key={kat.id} value={kat.id}>
                            {kat.nama}
                        </option>
                    ))}
                </select>

                {/* Sort */}
                <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                    {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default BeritaFilter;
