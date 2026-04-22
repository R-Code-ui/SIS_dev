import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ events, flash }) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const columns = [
        { key: 'title', label: 'Title' },
        {
            key: 'start_date',
            label: 'Start Date',
            render: (item) => new Date(item.start_date).toLocaleString()
        },
        {
            key: 'end_date',
            label: 'End Date',
            render: (item) => new Date(item.end_date).toLocaleString()
        },
        { key: 'venue', label: 'Venue', render: (item) => item.venue || '—' },
        {
            key: 'created_by',
            label: 'Created By',
            render: (item) => item.creator?.name || '—'
        },
    ];

    const handleEdit = (event) => {
        router.visit(route('admin.events.edit', event.id));
    };

    const handleDelete = (event) => {
        setSelectedEvent(event);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedEvent) return;

        router.delete(route('admin.events.destroy', selectedEvent.id), {
            onSuccess: () => {
                setDeleteModal(false);
                setSelectedEvent(null);
            }
        });
    };

    return (
        <AuthenticatedLayout header="Events Management">
            <Head title="Events" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
                        <Link href={route('admin.events.create')}>
                            <Button variant="primary">Add New Event</Button>
                        </Link>
                    </div>

                    {flash?.success && <FlashMessage message={flash.success} type="success" />}
                    {flash?.error && <FlashMessage message={flash.error} type="error" />}

                    <DataTable
                        columns={columns}
                        data={events.data}
                        actions={true}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                    {events.links && events.links.length > 3 && (
                        <div className="mt-6 flex justify-center flex-wrap">
                            {events.links.map((link, idx) => (
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
                        Are you sure you want to delete event{' '}
                        <strong>{selectedEvent?.title}</strong>?
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
