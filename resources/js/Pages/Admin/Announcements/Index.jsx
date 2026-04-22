import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ announcements, flash }) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    const columns = [
        { key: 'title', label: 'Title' },
        { key: 'content', label: 'Content', render: (item) => item.content?.substring(0, 80) + (item.content?.length > 80 ? '…' : '') },
        {
            key: 'expiry_date',
            label: 'Expiry Date',
            render: (item) => item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : '—'
        },
        { key: 'publisher', label: 'Published By', render: (item) => item.publisher?.name || '—' },
        { key: 'created_at', label: 'Published', render: (item) => new Date(item.created_at).toLocaleDateString() },
    ];

    const handleEdit = (announcement) => {
        router.visit(route('admin.announcements.edit', announcement.id));
    };

    const handleDelete = (announcement) => {
        setSelectedAnnouncement(announcement);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedAnnouncement) return;

        router.delete(route('admin.announcements.destroy', selectedAnnouncement.id), {
            onSuccess: () => {
                setDeleteModal(false);
                setSelectedAnnouncement(null);
            }
        });
    };

    return (
        <AuthenticatedLayout header="Announcements">
            <Head title="Announcements" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Announcements</h1>
                        <Link href={route('admin.announcements.create')}>
                            <Button variant="primary">Add New Announcement</Button>
                        </Link>
                    </div>

                    {flash?.success && <FlashMessage message={flash.success} type="success" />}
                    {flash?.error && <FlashMessage message={flash.error} type="error" />}

                    <DataTable
                        columns={columns}
                        data={announcements.data}
                        actions={true}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                    {announcements.links && announcements.links.length > 3 && (
                        <div className="mt-6 flex justify-center flex-wrap">
                            {announcements.links.map((link, idx) => (
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
                        Are you sure you want to delete announcement{' '}
                        <strong>{selectedAnnouncement?.title}</strong>?
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
