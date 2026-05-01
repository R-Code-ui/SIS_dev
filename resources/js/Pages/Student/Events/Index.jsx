import StudentLayout from '@/Layouts/StudentLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ events, venues, filters }) {
    const safeFilters = filters || {};
    const [search, setSearch] = useState(safeFilters.search || '');
    const [venue, setVenue] = useState(safeFilters.venue || '');
    const [sort, setSort] = useState(safeFilters.sort || 'start_date_asc');

    const applyFilters = () => {
        router.get(route('student.events.index'), {
            search,
            venue,
            sort,
        }, { preserveState: true, preserveScroll: true });
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
        { key: 'creator', label: 'Created By', render: (item) => item.creator?.name || '—' },
    ];

    const data = events?.data || [];
    const links = events?.links || [];

    return (
        <StudentLayout header="Upcoming Events">
            <Head title="Events" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-4">Upcoming Events</h1>

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
                        <div className="w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                            <select
                                value={venue}
                                onChange={(e) => { setVenue(e.target.value); setTimeout(applyFilters, 0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            >
                                <option value="">All Venues</option>
                                {venues?.map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                        <div className="w-64">
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
        </StudentLayout>
    );
}
