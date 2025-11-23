const Skeleton = ({ variant = 'card', count = 1 }) => {
    const CardSkeleton = () => (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="skeleton h-48 w-full"></div>
            <div className="p-4">
                <div className="skeleton h-4 w-20 mb-2 rounded"></div>
                <div className="skeleton h-6 w-full mb-2 rounded"></div>
                <div className="skeleton h-4 w-full mb-1 rounded"></div>
                <div className="skeleton h-4 w-3/4 mb-3 rounded"></div>
                <div className="flex items-center justify-between">
                    <div className="skeleton h-4 w-24 rounded"></div>
                    <div className="skeleton h-4 w-16 rounded"></div>
                </div>
            </div>
        </div>
    );

    const HeroSkeleton = () => (
        <div className="relative">
            <div className="skeleton h-96 w-full rounded-lg"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70">
                <div className="skeleton h-8 w-3/4 mb-2 rounded bg-white/20"></div>
                <div className="skeleton h-4 w-1/2 rounded bg-white/20"></div>
            </div>
        </div>
    );

    const ListSkeleton = () => (
        <div className="flex gap-4 bg-white p-4 rounded-lg shadow-md">
            <div className="skeleton h-24 w-32 rounded"></div>
            <div className="flex-1">
                <div className="skeleton h-4 w-20 mb-2 rounded"></div>
                <div className="skeleton h-5 w-full mb-2 rounded"></div>
                <div className="skeleton h-4 w-3/4 mb-2 rounded"></div>
                <div className="skeleton h-4 w-24 rounded"></div>
            </div>
        </div>
    );

    const CategorySkeleton = () => (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="skeleton h-16 w-16 rounded-full mb-3 mx-auto"></div>
            <div className="skeleton h-5 w-3/4 mx-auto mb-2 rounded"></div>
            <div className="skeleton h-4 w-1/2 mx-auto rounded"></div>
        </div>
    );

    const getSkeletonComponent = () => {
        switch (variant) {
            case 'hero':
                return <HeroSkeleton />;
            case 'list':
                return <ListSkeleton />;
            case 'category':
                return <CategorySkeleton />;
            default:
                return <CardSkeleton />;
        }
    };

    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index}>{getSkeletonComponent()}</div>
            ))}
        </>
    );
};

export default Skeleton;
