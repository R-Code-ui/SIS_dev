import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ messages, flash }) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);

    const columns = [
        { key: 'subject', label: 'Subject' },
        { key: 'sender', label: 'From', render: (item) => item.sender?.name || '—' },
        { key: 'receiver', label: 'To', render: (item) => item.receiver?.name || '—' },
        { key: 'body', label: 'Message', render: (item) => item.body?.substring(0, 60) + (item.body?.length > 60 ? '…' : '') },
        { key: 'created_at', label: 'Sent', render: (item) => new Date(item.created_at).toLocaleString() },
        { key: 'is_read', label: 'Status', render: (item) => item.is_read ? 'Read' : 'Unread' },
    ];

    const handleDelete = (message) => {
        setSelectedMessage(message);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedMessage) return;

        router.delete(route('admin.messages.destroy', selectedMessage.id), {
            onSuccess: () => {
                setDeleteModal(false);
                setSelectedMessage(null);
            }
        });
    };

    return (
        <AuthenticatedLayout header="Messages">
            <Head title="Messages" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">All Messages</h1>
                    </div>

                    {flash?.success && <FlashMessage message={flash.success} type="success" />}
                    {flash?.error && <FlashMessage message={flash.error} type="error" />}

                    <DataTable
                        columns={columns}
                        data={messages.data}
                        actions={true}
                        onDelete={handleDelete}
                    />

                    {messages.links && messages.links.length > 3 && (
                        <div className="mt-6 flex justify-center flex-wrap">
                            {messages.links.map((link, idx) => (
                                <span key={idx}>
                                    {link.url ? (
                                        <Link
                                            href={link.url}
                                            className={`px-3 py-1 mx-1 rounded text-sm ${
                                                link.active
                                                    ? 'bg-green-700 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            className="px-3 py-1 mx-1 rounded text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
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
                    <p className="text-gray-700">
                        Are you sure you want to delete message{' '}
                        <strong>{selectedMessage?.subject}</strong>?
                    </p>
                    <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="secondary" onClick={() => setDeleteModal(false)}>Cancel</Button>
                        <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
