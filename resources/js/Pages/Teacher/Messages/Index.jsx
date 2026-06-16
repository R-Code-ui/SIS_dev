import TeacherLayout from '@/Layouts/TeacherLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ messages, filters }) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);

    let safeFilters = {};
    if (filters && typeof filters === 'object' && !Array.isArray(filters)) {
        safeFilters = filters;
    }

    const [search, setSearch] = useState(safeFilters.search || '');
    const [type, setType] = useState(safeFilters.type || '');
    const [sort, setSort] = useState(safeFilters.sort || 'latest');

    const applyFilters = () => {
        router.get(route('teacher.messages.index'), { search, type, sort }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchKeyDown = (e) => e.key === 'Enter' && applyFilters();

    const columns = [
        { key: 'subject', label: 'Subject', render: (item) => item.subject?.substring(0, 50) || '—' },
        { key: 'sender', label: 'From', render: (item) => item.sender?.name || '—' },
        { key: 'receiver', label: 'To', render: (item) => item.receiver?.name || '—' },
        { key: 'created_at', label: 'Sent', render: (item) => new Date(item.created_at).toLocaleString() },
        {
            key: 'is_read',
            label: 'Status',
            render: (item) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.is_read ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {item.is_read ? 'Read' : 'Unread'}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (item) => (
                <div className="flex space-x-2">
                    <Button variant="primary" onClick={() => router.visit(route('teacher.messages.show', item.id))}>View</Button>
                    <Button variant="danger" onClick={() => { setSelectedMessage(item); setDeleteModal(true); }}>Delete</Button>
                </div>
            )
        },
    ];

    const data = messages?.data && Array.isArray(messages.data) ? messages.data : [];
    const links = messages?.links && Array.isArray(messages.links) ? messages.links : [];

    const confirmDelete = () => {
        if (!selectedMessage) return;
        router.delete(route('teacher.messages.destroy', selectedMessage.id), {
            onSuccess: () => { setDeleteModal(false); setSelectedMessage(null); }
        });
    };

    return (
        <TeacherLayout header="Messages">
            <Head title="Messages" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
                        <Button variant="primary" onClick={() => router.visit(route('teacher.messages.create'))}>
                            New Message
                        </Button>
                    </div>

                    {messages?.flash?.success && <FlashMessage message={messages.flash.success} type="success" />}
                    {messages?.flash?.error && <FlashMessage message={messages.flash.error} type="error" />}

                    <div className="mb-4 flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input
                                type="text"
                                placeholder="Subject, sender, receiver..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            />
                        </div>
                        <div className="w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                value={type}
                                onChange={e => { setType(e.target.value); setTimeout(applyFilters, 0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            >
                                <option value="">All</option>
                                <option value="received">Received</option>
                                <option value="sent">Sent</option>
                            </select>
                        </div>
                        <div className="w-56">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                            <select
                                value={sort}
                                onChange={e => { setSort(e.target.value); setTimeout(applyFilters, 0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            >
                                <option value="latest">Latest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="subject_asc">Subject (A-Z)</option>
                                <option value="subject_desc">Subject (Z-A)</option>
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

            <Modal show={deleteModal} onClose={() => setDeleteModal(false)} maxWidth="sm">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
                    <p>Are you sure you want to delete this message?</p>
                    <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="secondary" onClick={() => setDeleteModal(false)}>Cancel</Button>
                        <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </TeacherLayout>
    );
}
