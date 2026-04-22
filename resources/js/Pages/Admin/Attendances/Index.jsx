import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ attendances, flash }) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState(null);

    const columns = [
        { key: 'student', label: 'Student', render: (item) => item.student?.user?.name || '—' },
        { key: 'class', label: 'Class', render: (item) => item.class?.name || '—' },
        { key: 'date', label: 'Date', render: (item) => new Date(item.date).toLocaleDateString() },
        {
            key: 'status',
            label: 'Status',
            render: (item) => {
                const statusColors = {
                    present: 'bg-green-100 text-green-800',
                    absent: 'bg-red-100 text-red-800',
                    late: 'bg-yellow-100 text-yellow-800',
                    excused: 'bg-blue-100 text-blue-800',
                };
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.status] || 'bg-gray-100 text-gray-800'}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                );
            }
        },
        { key: 'remarks', label: 'Remarks', render: (item) => item.remarks || '—' },
    ];

    const handleEdit = (attendance) => {
        router.visit(route('admin.attendances.edit', attendance.id));
    };

    const handleDelete = (attendance) => {
        setSelectedAttendance(attendance);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedAttendance) return;

        router.delete(route('admin.attendances.destroy', selectedAttendance.id), {
            onSuccess: () => {
                setDeleteModal(false);
                setSelectedAttendance(null);
            }
        });
    };

    return (
        <AuthenticatedLayout header="Attendance Management">
            <Head title="Attendance" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Attendance Records</h1>
                        <Link href={route('admin.attendances.create')}>
                            <Button variant="primary">Add New Attendance</Button>
                        </Link>
                    </div>

                    {flash?.success && <FlashMessage message={flash.success} type="success" />}
                    {flash?.error && <FlashMessage message={flash.error} type="error" />}

                    <DataTable
                        columns={columns}
                        data={attendances.data}
                        actions={true}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                    {attendances.links && attendances.links.length > 3 && (
                        <div className="mt-6 flex justify-center flex-wrap">
                            {attendances.links.map((link, idx) => (
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
                        Are you sure you want to delete attendance record for{' '}
                        <strong>{selectedAttendance?.student?.user?.name}</strong> on{' '}
                        {selectedAttendance && new Date(selectedAttendance.date).toLocaleDateString()}?
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
