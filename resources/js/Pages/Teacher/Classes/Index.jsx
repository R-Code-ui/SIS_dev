import TeacherLayout from '@/Layouts/TeacherLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ classes, filters }) {
    // Safe filters
    let safeFilters = {};
    if (filters && typeof filters === 'object' && !Array.isArray(filters)) {
        safeFilters = filters;
    }

    const [search, setSearch] = useState(() => safeFilters.search || '');
    const [sortValue, setSortValue] = useState(() => safeFilters.sort || 'name_asc');

    const applyFilters = () => {
        router.get(route('teacher.classes.index'), { search, sort: sortValue }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Safe data extraction
    const classesData = classes?.data && Array.isArray(classes.data) ? classes.data : [];
    const links = classes?.links && Array.isArray(classes.links) ? classes.links : [];

    const columns = [
        { key: 'name', label: 'Class Name' },
        { key: 'grade_level', label: 'Grade Level' },
        { key: 'academic_year', label: 'Academic Year' },
        { key: 'section', label: 'Section', render: (item) => item?.section || '-' },
        { key: 'capacity', label: 'Capacity', render: (item) => item?.capacity || '-' },
    ];

    return (
        <TeacherLayout header="My Classes">
            <Head title="Classes" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-4">My Classes</h1>

                    <div className="mb-4 flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input
                                type="text"
                                placeholder="Class name or grade level..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            />
                        </div>
                        <div className="w-56">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                            <select
                                value={sortValue}
                                onChange={(e) => {
                                    setSortValue(e.target.value);
                                    setTimeout(applyFilters, 0);
                                }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            >
                                <option value="name_asc">Name (A-Z)</option>
                                <option value="name_desc">Name (Z-A)</option>
                            </select>
                        </div>
                        <Button variant="primary" onClick={applyFilters}>Apply Filters</Button>
                    </div>

                    <DataTable columns={columns} data={classesData} actions={false} />

                    {links.length > 3 && (
                        <div className="mt-6 flex justify-center flex-wrap">
                            {links.map((link, idx) => (
                                <span key={idx}>
                                    {link.url ? (
                                        <a
                                            href={link.url}
                                            className={`px-3 py-1 mx-1 rounded text-sm ${link.active ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.get(link.url, {}, { preserveState: true, preserveScroll: true });
                                            }}
                                        />
                                    ) : (
                                        <span className="px-3 py-1 mx-1 rounded text-sm bg-gray-100 text-gray-400 cursor-not-allowed" dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </TeacherLayout>
    );
}
