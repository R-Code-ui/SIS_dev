import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ assignments, flash }) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    const columns = [
        { key: 'title', label: 'Title' },
        { key: 'class', label: 'Class', render: (item) => item.class?.name || '—' },
        { key: 'subject', label: 'Subject', render: (item) => item.subject?.name || '—' },
        { key: 'teacher', label: 'Teacher', render: (item) => item.teacher?.user?.name || '—' },
        { key: 'due_date', label: 'Due Date', render: (item) => new Date(item.due_date).toLocaleDateString() },
        { key: 'file_path', label: 'Attachment', render: (item) => item.file_path ? '📎 Yes' : '—' },
    ];

    const handleEdit = (assignment) => {
        router.visit(route('admin.assignments.edit', assignment.id));
    };

    const handleDelete = (assignment) => {
        setSelectedAssignment(assignment);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedAssignment) return;

        router.delete(route('admin.assignments.destroy', selectedAssignment.id), {
            onSuccess: () => {
                setDeleteModal(false);
                setSelectedAssignment(null);
            }
        });
    };

    return (
        <AuthenticatedLayout header="Assignments Management">
            <Head title="Assignments" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Assignments</h1>
                        <Link href={route('admin.assignments.create')}>
                            <Button variant="primary">Add New Assignment</Button>
                        </Link>
                    </div>

                    {flash?.success && <FlashMessage message={flash.success} type="success" />}
                    {flash?.error && <FlashMessage message={flash.error} type="error" />}

                    <DataTable
                        columns={columns}
                        data={assignments.data}
                        actions={true}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                    {assignments.links && assignments.links.length > 3 && (
                        <div className="mt-6 flex justify-center flex-wrap">
                            {assignments.links.map((link, idx) => (
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
                        Are you sure you want to delete assignment{' '}
                        <strong>{selectedAssignment?.title}</strong>?
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
