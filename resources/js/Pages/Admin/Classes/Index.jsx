import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ classes, flash }) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);

    const columns = [
        { key: 'name', label: 'Class Name' },
        { key: 'grade_level', label: 'Grade Level' },
        { key: 'academic_year', label: 'Academic Year' },
        { key: 'section', label: 'Section' },
        { key: 'capacity', label: 'Capacity' },
        {
            key: 'teachers_count',
            label: 'Teachers',
            render: (item) => item.teachers_count ?? 0
        },
        {
            key: 'subjects_count',
            label: 'Subjects',
            render: (item) => item.subjects_count ?? 0
        },
    ];

    const handleEdit = (classItem) => {
        router.visit(route('admin.classes.edit', classItem.id));
    };

    const handleDelete = (classItem) => {
        setSelectedClass(classItem);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedClass) return;

        router.delete(route('admin.classes.destroy', selectedClass.id), {
            onSuccess: () => {
                setDeleteModal(false);
                setSelectedClass(null);
            }
        });
    };

    return (
        <AuthenticatedLayout header="Classes Management">
            <Head title="Classes" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Classes</h1>
                        <Link href={route('admin.classes.create')}>
                            <Button variant="primary">Add New Class</Button>
                        </Link>
                    </div>

                    {flash?.success && <FlashMessage message={flash.success} type="success" />}
                    {flash?.error && <FlashMessage message={flash.error} type="error" />}

                    <DataTable
                        columns={columns}
                        data={classes.data}
                        actions={true}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                    {classes.links && classes.links.length > 3 && (
                        <div className="mt-6 flex justify-center flex-wrap">
                            {classes.links.map((link, idx) => (
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
                        Are you sure you want to delete class{' '}
                        <strong>{selectedClass?.name}</strong>?
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
