import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ events, venues, filters = {} }) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [search, setSearch] = useState(filters.search || '');
    const [venue, setVenue] = useState(filters.venue || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [sort, setSort] = useState(filters.sort || 'latest');

    const applyFilters = () => {
        router.get(route('admin.events.index'), { search, venue, date_from: dateFrom, date_to: dateTo, sort },
            { preserveState: true, preserveScroll: true });
    };
    const handleSearchKeyDown = (e) => e.key === 'Enter' && applyFilters();

    const columns = [
        { key: 'title', label: 'Title' },
        { key: 'start_date', label: 'Start Date', render: (item) => new Date(item.start_date).toLocaleString() },
        { key: 'end_date', label: 'End Date', render: (item) => new Date(item.end_date).toLocaleString() },
        { key: 'venue', label: 'Venue', render: (item) => item.venue || '—' },
        { key: 'created_by', label: 'Created By', render: (item) => item.creator?.name || '—' },
    ];

    const handleEdit = (event) => router.visit(route('admin.events.edit', event.id));
    const handleDelete = (event) => { setSelectedEvent(event); setDeleteModal(true); };
    const confirmDelete = () => {
        if (!selectedEvent) return;
        router.delete(route('admin.events.destroy', selectedEvent.id), {
            onSuccess: () => { setDeleteModal(false); setSelectedEvent(null); }
        });
    };

    const data = events?.data ?? [];
    const links = events?.links ?? [];

    return (
        <AuthenticatedLayout header="Events Management">
            <Head title="Events" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
                        <Link href={route('admin.events.create')}><Button variant="primary">Add New Event</Button></Link>
                    </div>

                    {events?.flash?.success && <FlashMessage message={events.flash.success} type="success" />}
                    {events?.flash?.error && <FlashMessage message={events.flash.error} type="error" />}

                    <div className="mb-4 flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input type="text" placeholder="Title, venue, description..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleSearchKeyDown}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                        </div>
                        <div className="w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                            <select value={venue} onChange={e => { setVenue(e.target.value); setTimeout(applyFilters,0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                                <option value="">All Venues</option>
                                {venues?.map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                        <div className="w-40">
                            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                            <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setTimeout(applyFilters,0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                        </div>
                        <div className="w-40">
                            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                            <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setTimeout(applyFilters,0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                        </div>
                        <div className="w-64">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                            <select value={sort} onChange={e => { setSort(e.target.value); setTimeout(applyFilters,0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                                <option value="latest">Latest First</option>
                                <option value="title_asc">Title (A-Z)</option>
                                <option value="title_desc">Title (Z-A)</option>
                                <option value="start_date_asc">Start Date (Earliest)</option>
                                <option value="start_date_desc">Start Date (Latest)</option>
                            </select>
                        </div>
                        <Button variant="primary" onClick={applyFilters}>Apply Filters</Button>
                    </div>

                    <DataTable columns={columns} data={data} actions={true} onEdit={handleEdit} onDelete={handleDelete} />

                    {links.length > 3 && (
                        <div className="mt-6 flex justify-center flex-wrap">
                            {links.map((link, idx) => (
                                <span key={idx}>
                                    {link.url ? (
                                        <Link href={link.url} className={`px-3 py-1 mx-1 rounded text-sm ${link.active ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }} />
                                    ) : (
                                        <span className="px-3 py-1 mx-1 rounded text-sm bg-gray-100 text-gray-400 cursor-not-allowed" dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Modal show={deleteModal} onClose={() => setDeleteModal(false)} maxWidth="sm">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
                    <p>Delete event <strong>{selectedEvent?.title}</strong>?</p>
                    <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="secondary" onClick={() => setDeleteModal(false)}>Cancel</Button>
                        <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
