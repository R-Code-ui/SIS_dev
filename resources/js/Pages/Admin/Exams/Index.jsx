import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ exams, flash }) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedExam, setSelectedExam] = useState(null);

    const columns = [
        { key: 'title', label: 'Exam Title' },
        { key: 'class', label: 'Class', render: (item) => item.class?.name || '—' },
        { key: 'subject', label: 'Subject', render: (item) => item.subject?.name || '—' },
        { key: 'date', label: 'Date', render: (item) => new Date(item.date).toLocaleDateString() },
        { key: 'max_marks', label: 'Max Marks' },
        { key: 'passing_marks', label: 'Passing Marks' },
    ];

    const handleEdit = (exam) => {
        router.visit(route('admin.exams.edit', exam.id));
    };

    const handleDelete = (exam) => {
        setSelectedExam(exam);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedExam) return;

        router.delete(route('admin.exams.destroy', selectedExam.id), {
            onSuccess: () => {
                setDeleteModal(false);
                setSelectedExam(null);
            }
        });
    };

    return (
        <AuthenticatedLayout header="Exams Management">
            <Head title="Exams" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Exams</h1>
                        <Link href={route('admin.exams.create')}>
                            <Button variant="primary">Add New Exam</Button>
                        </Link>
                    </div>

                    {flash?.success && <FlashMessage message={flash.success} type="success" />}
                    {flash?.error && <FlashMessage message={flash.error} type="error" />}

                    <DataTable
                        columns={columns}
                        data={exams.data}
                        actions={true}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                    {exams.links && exams.links.length > 3 && (
                        <div className="mt-6 flex justify-center flex-wrap">
                            {exams.links.map((link, idx) => (
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
                        Are you sure you want to delete exam{' '}
                        <strong>{selectedExam?.title}</strong>?
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
