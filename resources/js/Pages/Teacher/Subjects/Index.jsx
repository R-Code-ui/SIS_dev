import TeacherLayout from '@/Layouts/TeacherLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ subjects, filters }) {
    // Safe filters – handle any falsy value
    let safeFilters = {};
    if (filters && typeof filters === 'object' && !Array.isArray(filters)) {
        safeFilters = filters;
    }

    const [search, setSearch] = useState(() => safeFilters.search || '');
    const [sortValue, setSortValue] = useState(() => safeFilters.sort || 'name_asc');

    const applyFilters = () => {
        router.get(route('teacher.subjects.index'), { search, sort: sortValue }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Safe data extraction – ensure subjects is an object
    const subjectsData = subjects?.data && Array.isArray(subjects.data) ? subjects.data : [];
    const links = subjects?.links && Array.isArray(subjects.links) ? subjects.links : [];

    const columns = [
        { key: 'code', label: 'Subject Code' },
        { key: 'name', label: 'Subject Name' },
        { key: 'credits', label: 'Credits', render: (item) => item?.credits ?? '-' },
        { key: 'description', label: 'Description', render: (item) => item?.description?.substring(0, 60) + (item?.description?.length > 60 ? '…' : '') || '-' },
    ];

    return (
        <TeacherLayout header="Subjects">
            <Head title="Subjects" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-4">My Subjects</h1>
                    <div className="mb-4 flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input
                                type="text"
                                placeholder="Subject name or code..."
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
                                <option value="code_asc">Code (A-Z)</option>
                                <option value="code_desc">Code (Z-A)</option>
                            </select>
                        </div>
                        <Button variant="primary" onClick={applyFilters}>Apply Filters</Button>
                    </div>
                    <DataTable columns={columns} data={subjectsData} actions={false} />
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
