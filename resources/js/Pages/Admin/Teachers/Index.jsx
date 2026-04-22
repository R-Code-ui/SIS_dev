import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ teachers, flash }) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    const columns = [
        { key: 'employee_id', label: 'Employee ID' },
        { key: 'name', label: 'Name', render: (item) => item.user?.name },
        { key: 'email', label: 'Email', render: (item) => item.user?.email },
        { key: 'department', label: 'Department' },
        { key: 'phone', label: 'Phone' },
    ];

    const handleEdit = (teacher) => {
        router.visit(route('admin.teachers.edit', teacher.id));
    };

    const handleDelete = (teacher) => {
        setSelectedTeacher(teacher);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedTeacher) return;

        router.delete(route('admin.teachers.destroy', selectedTeacher.id), {
            onSuccess: () => {
                setDeleteModal(false);
                setSelectedTeacher(null);
            }
        });
    };

    return (
        <AuthenticatedLayout header="Teachers Management">
            <Head title="Teachers" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="mb-4 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Teachers</h1>
                        <Link href={route('admin.teachers.create')}>
                            <Button variant="primary">Add New Teacher</Button>
                        </Link>
                    </div>

                    {/* Flash Messages */}
                    {flash?.success && <FlashMessage message={flash.success} type="success" />}
                    {flash?.error && <FlashMessage message={flash.error} type="error" />}

                    {/* Data Table */}
                    <DataTable
                        columns={columns}
                        data={teachers.data}
                        actions={true}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                    {/* ✅ FIXED Pagination */}
                    {teachers.links && teachers.links.length > 3 && (
                        <div className="mt-6 flex justify-center flex-wrap">

                            {teachers.links.map((link, idx) => (
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

            {/* Delete Modal */}
            <Modal show={deleteModal} onClose={() => setDeleteModal(false)} maxWidth="sm">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
                    <p className="text-gray-700">
                        Are you sure you want to delete teacher{' '}
                        <strong>{selectedTeacher?.user?.name}</strong>?
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
