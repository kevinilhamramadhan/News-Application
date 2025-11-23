import { useState, useEffect } from 'react';
import {
    Newspaper,
    Code,
    Zap,
    CheckCircle,
    Mail,
    Github,
    Globe,
} from 'lucide-react';
import { beritaService } from '../services/beritaService';
import { kategoriService } from '../services/kategoriService';

const ProfilPage = () => {
    const [stats, setStats] = useState({
        totalBerita: 0,
        totalKategori: 0,
        totalViews: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [beritaRes, kategoriRes] = await Promise.all([
                    beritaService.getAll({ limit: 1 }),
                    kategoriService.getAll(),
                ]);

                const beritaData = beritaRes.data;
                const kategoriData = kategoriRes.data;

                setStats({
                    totalBerita: beritaData.pagination?.total || beritaData.data?.length || 0,
                    totalKategori: kategoriData.data?.length || 0,
                    totalViews: beritaData.data?.reduce((sum, b) => sum + (b.views || 0), 0) || 0,
                });
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            }
        };

        fetchStats();
    }, []);

    const features = [
        'Berita terkini dari berbagai kategori',
        'Sistem bookmark untuk menyimpan berita favorit',
        'Pencarian dan filter berita',
        'Responsive design untuk semua perangkat',
        'Navigasi yang mudah dan intuitif',
        'Tampilan yang modern dan menarik',
    ];

    const technologies = [
        { name: 'React', icon: Code },
        { name: 'Vite', icon: Zap },
        { name: 'Tailwind CSS', icon: Globe },
        { name: 'Axios', icon: Globe },
        { name: 'Lucide React', icon: CheckCircle },
    ];

    return (
        <div className="page-transition">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 mb-8 text-white text-center">
                <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                        <Newspaper className="w-10 h-10" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold mb-2">Portal Berita</h1>
                <p className="text-primary-100">Versi 1.0.0</p>
            </div>

            {/* About */}
            <section className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tentang Aplikasi</h2>
                <p className="text-gray-700 leading-relaxed">
                    Portal Berita adalah aplikasi web modern untuk membaca berita terkini dari
                    berbagai kategori. Aplikasi ini dibangun dengan teknologi terkini untuk
                    memberikan pengalaman terbaik dalam mengakses informasi.
                </p>
            </section>

            {/* Features */}
            <section className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Fitur Aplikasi</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{feature}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Statistics */}
            <section className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Statistik</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-primary-50 rounded-lg">
                        <div className="text-3xl font-bold text-primary-600 mb-1">
                            {stats.totalBerita}
                        </div>
                        <div className="text-sm text-gray-600">Total Berita</div>
                    </div>
                    <div className="text-center p-4 bg-primary-50 rounded-lg">
                        <div className="text-3xl font-bold text-primary-600 mb-1">
                            {stats.totalKategori}
                        </div>
                        <div className="text-sm text-gray-600">Total Kategori</div>
                    </div>
                    <div className="text-center p-4 bg-primary-50 rounded-lg">
                        <div className="text-3xl font-bold text-primary-600 mb-1">
                            {stats.totalViews}
                        </div>
                        <div className="text-sm text-gray-600">Total Views</div>
                    </div>
                </div>
            </section>

            {/* Technologies */}
            <section className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Teknologi yang Digunakan
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {technologies.map((tech, index) => {
                        const Icon = tech.icon;
                        return (
                            <div
                                key={index}
                                className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <Icon className="w-8 h-8 text-primary-600" />
                                <span className="text-sm font-medium text-gray-700">
                                    {tech.name}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Contact */}
            <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Kontak & Media Sosial</h2>
                <div className="flex flex-wrap gap-4">
                    <a
                        href="mailto:contact@portalberita.com"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <Mail className="w-5 h-5" />
                        <span>Email</span>
                    </a>
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <Github className="w-5 h-5" />
                        <span>GitHub</span>
                    </a>
                </div>
            </section>

            {/* Credits */}
            <div className="text-center text-gray-600 text-sm mt-8">
                <p>© 2025 Portal Berita. All rights reserved.</p>
                <p className="mt-1">Developed with ❤️ using React & Vite</p>
            </div>
        </div>
    );
};

export default ProfilPage;
