import TeacherLayout from '@/Layouts/TeacherLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ attendances, classes, filters }) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState(null);

    let safeFilters = {};
    if (filters && typeof filters === 'object' && !Array.isArray(filters)) {
        safeFilters = filters;
    }

    const [search, setSearch] = useState(safeFilters.search || '');
    const [classId, setClassId] = useState(safeFilters.class_id || '');
    const [date, setDate] = useState(safeFilters.date || '');
    const [sort, setSort] = useState(safeFilters.sort || 'date_desc');

    const applyFilters = () => {
        router.get(route('teacher.attendances.index'), {
            search,
            class_id: classId,
            date,
            sort,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchKeyDown = (e) => e.key === 'Enter' && applyFilters();

    const columns = [
        { key: 'student', label: 'Student', render: (item) => item.student?.user?.name || '—' },
        { key: 'class', label: 'Class', render: (item) => item.class?.name || '—' },
        { key: 'date', label: 'Date', render: (item) => new Date(item.date).toLocaleDateString() },
        {
            key: 'status',
            label: 'Status',
            render: (item) => {
                const colors = {
                    present: 'bg-green-100 text-green-800',
                    absent: 'bg-red-100 text-red-800',
                    late: 'bg-yellow-100 text-yellow-800',
                    excused: 'bg-blue-100 text-blue-800',
                };
                return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[item.status] || 'bg-gray-100'}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>;
            }
        },
        { key: 'remarks', label: 'Remarks', render: (item) => item.remarks || '—' },
    ];

    const handleEdit = (att) => {
        router.visit(route('teacher.attendances.edit', att.id));
    };

    const handleDelete = (att) => {
        setSelectedAttendance(att);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedAttendance) return;
        router.delete(route('teacher.attendances.destroy', selectedAttendance.id), {
            onSuccess: () => {
                setDeleteModal(false);
                setSelectedAttendance(null);
            }
        });
    };

    const data = attendances?.data && Array.isArray(attendances.data) ? attendances.data : [];
    const links = attendances?.links && Array.isArray(attendances.links) ? attendances.links : [];
    const classesList = Array.isArray(classes) ? classes : [];

    return (
        <TeacherLayout header="Attendance Records">
            <Head title="Attendance" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Attendance Records</h1>
                        <Button variant="primary" onClick={() => router.visit(route('teacher.attendances.create'))}>
                            Mark Attendance
                        </Button>
                    </div>

                    {attendances?.flash?.success && <FlashMessage message={attendances.flash.success} type="success" />}
                    {attendances?.flash?.error && <FlashMessage message={attendances.flash.error} type="error" />}

                    <div className="mb-4 flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input
                                type="text"
                                placeholder="Student name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            />
                        </div>
                        <div className="w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                            <select
                                value={classId}
                                onChange={(e) => { setClassId(e.target.value); setTimeout(applyFilters, 0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            >
                                <option value="">All Classes</option>
                                {classesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="w-40">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => { setDate(e.target.value); setTimeout(applyFilters, 0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            />
                        </div>
                        <div className="w-56">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                            <select
                                value={sort}
                                onChange={(e) => { setSort(e.target.value); setTimeout(applyFilters, 0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            >
                                <option value="date_desc">Latest First</option>
                                <option value="date_asc">Oldest First</option>
                            </select>
                        </div>
                        <Button variant="primary" onClick={applyFilters}>Apply Filters</Button>
                    </div>

                    <DataTable
                        columns={columns}
                        data={data}
                        actions={true}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

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
                    <p>Delete this attendance record?</p>
                    <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="secondary" onClick={() => setDeleteModal(false)}>Cancel</Button>
                        <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </TeacherLayout>
    );
}
