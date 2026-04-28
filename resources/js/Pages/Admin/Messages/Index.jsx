import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ messages, filters = {} }) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);

    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [sort, setSort] = useState(filters.sort || 'latest');

    const applyFilters = () => {
        router.get(route('admin.messages.index'), { search, status, sort },
            { preserveState: true, preserveScroll: true });
    };
    const handleSearchKeyDown = (e) => e.key === 'Enter' && applyFilters();

    const columns = [
        { key: 'subject', label: 'Subject' },
        { key: 'sender', label: 'From', render: (item) => item.sender?.name || '—' },
        { key: 'receiver', label: 'To', render: (item) => item.receiver?.name || '—' },
        { key: 'body', label: 'Message', render: (item) => item.body?.substring(0, 60) + (item.body?.length > 60 ? '…' : '') },
        { key: 'created_at', label: 'Sent', render: (item) => new Date(item.created_at).toLocaleString() },
        { key: 'is_read', label: 'Status', render: (item) => item.is_read ? 'Read' : 'Unread' },
    ];

    const handleDelete = (msg) => { setSelectedMessage(msg); setDeleteModal(true); };
    const confirmDelete = () => {
        if (!selectedMessage) return;
        router.delete(route('admin.messages.destroy', selectedMessage.id), {
            onSuccess: () => { setDeleteModal(false); setSelectedMessage(null); }
        });
    };

    const data = messages?.data ?? [];
    const links = messages?.links ?? [];

    return (
        <AuthenticatedLayout header="Messages">
            <Head title="Messages" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <h1 className="text-2xl font-semibold text-gray-900">All Messages</h1>
                    </div>

                    {messages?.flash?.success && <FlashMessage message={messages.flash.success} type="success" />}
                    {messages?.flash?.error && <FlashMessage message={messages.flash.error} type="error" />}

                    <div className="mb-4 flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input type="text" placeholder="Subject, body, sender, receiver..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleSearchKeyDown}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                        </div>
                        <div className="w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select value={status} onChange={e => { setStatus(e.target.value); setTimeout(applyFilters,0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                                <option value="">All</option>
                                <option value="read">Read</option>
                                <option value="unread">Unread</option>
                            </select>
                        </div>
                        <div className="w-56">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                            <select value={sort} onChange={e => { setSort(e.target.value); setTimeout(applyFilters,0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                                <option value="latest">Latest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="subject_asc">Subject (A-Z)</option>
                                <option value="subject_desc">Subject (Z-A)</option>
                            </select>
                        </div>
                        <Button variant="primary" onClick={applyFilters}>Apply Filters</Button>
                    </div>

                    <DataTable columns={columns} data={data} actions={true} onDelete={handleDelete} />

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
                    <p>Delete message <strong>{selectedMessage?.subject}</strong>?</p>
                    <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="secondary" onClick={() => setDeleteModal(false)}>Cancel</Button>
                        <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
