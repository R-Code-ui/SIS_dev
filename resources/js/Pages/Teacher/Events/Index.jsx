import TeacherLayout from '@/Layouts/TeacherLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ events, filters }) {
    let safeFilters = {};
    if (filters && typeof filters === 'object' && !Array.isArray(filters)) {
        safeFilters = filters;
    }

    const [search, setSearch] = useState(safeFilters.search || '');
    const [sort, setSort] = useState(safeFilters.sort || 'start_date_asc');

    const applyFilters = () => {
        router.get(route('teacher.events.index'), { search, sort }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchKeyDown = (e) => e.key === 'Enter' && applyFilters();

    const columns = [
        { key: 'title', label: 'Title' },
        {
            key: 'start_date',
            label: 'Start Date',
            render: (item) => new Date(item.start_date).toLocaleString(),
        },
        {
            key: 'end_date',
            label: 'End Date',
            render: (item) => new Date(item.end_date).toLocaleString(),
        },
        { key: 'venue', label: 'Venue', render: (item) => item.venue || '—' },
        {
            key: 'actions',
            label: 'Actions',
            render: (item) => (
                <Button
                    variant="primary"
                    onClick={() => router.visit(route('teacher.events.show', item.id))}
                >
                    View
                </Button>
            ),
        },
    ];

    const data = events?.data && Array.isArray(events.data) ? events.data : [];
    const links = events?.links && Array.isArray(events.links) ? events.links : [];

    return (
        <TeacherLayout header="Events">
            <Head title="Events" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-4">Events</h1>

                    <div className="mb-4 flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input
                                type="text"
                                placeholder="Title or venue..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            />
                        </div>
                        <div className="w-56">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                            <select
                                value={sort}
                                onChange={(e) => { setSort(e.target.value); setTimeout(applyFilters, 0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            >
                                <option value="start_date_asc">Earliest First</option>
                                <option value="start_date_desc">Latest First</option>
                                <option value="title_asc">Title (A-Z)</option>
                                <option value="title_desc">Title (Z-A)</option>
                            </select>
                        </div>
                        <Button variant="primary" onClick={applyFilters}>Apply Filters</Button>
                    </div>

                    <DataTable columns={columns} data={data} actions={false} />

                    {links.length > 3 && (
                        <div className="mt-6 flex justify-center flex-wrap">
                            {links.map((link, idx) => (
                                <span key={idx}>
                                    {link.url ? (
                                        <a
                                            href={link.url}
                                            className={`px-3 py-1 mx-1 rounded text-sm ${link.active ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                            onClick={(e) => { e.preventDefault(); router.get(link.url, {}, { preserveState: true, preserveScroll: true }); }}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
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
