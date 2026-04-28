import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ announcements, filters = {} }) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    const [search, setSearch] = useState(filters.search || '');
    const [expired, setExpired] = useState(filters.expired || '');
    const [sort, setSort] = useState(filters.sort || 'latest');

    const applyFilters = () => {
        router.get(route('admin.announcements.index'), { search, expired, sort },
            { preserveState: true, preserveScroll: true });
    };
    const handleSearchKeyDown = (e) => e.key === 'Enter' && applyFilters();

    const columns = [
        { key: 'title', label: 'Title' },
        { key: 'content', label: 'Content', render: (item) => item.content?.substring(0, 80) + (item.content?.length > 80 ? '…' : '') },
        { key: 'expiry_date', label: 'Expiry Date', render: (item) => item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : '—' },
        { key: 'publisher', label: 'Published By', render: (item) => item.publisher?.name || '—' },
        { key: 'created_at', label: 'Published', render: (item) => new Date(item.created_at).toLocaleDateString() },
    ];

    const handleEdit = (ann) => router.visit(route('admin.announcements.edit', ann.id));
    const handleDelete = (ann) => { setSelectedAnnouncement(ann); setDeleteModal(true); };
    const confirmDelete = () => {
        if (!selectedAnnouncement) return;
        router.delete(route('admin.announcements.destroy', selectedAnnouncement.id), {
            onSuccess: () => { setDeleteModal(false); setSelectedAnnouncement(null); }
        });
    };

    const data = announcements?.data ?? [];
    const links = announcements?.links ?? [];

    return (
        <AuthenticatedLayout header="Announcements">
            <Head title="Announcements" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Announcements</h1>
                        <Link href={route('admin.announcements.create')}><Button variant="primary">Add New Announcement</Button></Link>
                    </div>

                    {announcements?.flash?.success && <FlashMessage message={announcements.flash.success} type="success" />}
                    {announcements?.flash?.error && <FlashMessage message={announcements.flash.error} type="error" />}

                    <div className="mb-4 flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input type="text" placeholder="Title or content..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleSearchKeyDown}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                        </div>
                        <div className="w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select value={expired} onChange={e => { setExpired(e.target.value); setTimeout(applyFilters,0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                                <option value="">All</option>
                                <option value="active">Active (not expired)</option>
                                <option value="expired">Expired</option>
                            </select>
                        </div>
                        <div className="w-56">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                            <select value={sort} onChange={e => { setSort(e.target.value); setTimeout(applyFilters,0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                                <option value="latest">Latest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="title_asc">Title (A-Z)</option>
                                <option value="title_desc">Title (Z-A)</option>
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
                    <p>Delete announcement <strong>{selectedAnnouncement?.title}</strong>?</p>
                    <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="secondary" onClick={() => setDeleteModal(false)}>Cancel</Button>
                        <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
