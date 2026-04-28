import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ attendances, classes, statuses, filters = {} }) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState(null);

    const [search, setSearch] = useState(filters.search || '');
    const [classId, setClassId] = useState(filters.class_id || '');
    const [status, setStatus] = useState(filters.status || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [sort, setSort] = useState(filters.sort || 'latest');

    const applyFilters = () => {
        router.get(route('admin.attendances.index'), {
            search, class_id: classId, status, date_from: dateFrom, date_to: dateTo, sort,
        }, { preserveState: true, preserveScroll: true });
    };

    const handleSearchKeyDown = (e) => e.key === 'Enter' && applyFilters();

    const columns = [
        { key: 'student', label: 'Student', render: (item) => item.student?.user?.name || '—' },
        { key: 'class', label: 'Class', render: (item) => item.class?.name || '—' },
        { key: 'date', label: 'Date', render: (item) => new Date(item.date).toLocaleDateString() },
        {
            key: 'status', label: 'Status',
            render: (item) => {
                const colors = { present: 'bg-green-100 text-green-800', absent: 'bg-red-100 text-red-800', late: 'bg-yellow-100 text-yellow-800', excused: 'bg-blue-100 text-blue-800' };
                return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[item.status] || 'bg-gray-100'}`}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>;
            }
        },
        { key: 'remarks', label: 'Remarks', render: (item) => item.remarks || '—' },
    ];

    const handleEdit = (att) => router.visit(route('admin.attendances.edit', att.id));
    const handleDelete = (att) => { setSelectedAttendance(att); setDeleteModal(true); };
    const confirmDelete = () => {
        if (!selectedAttendance) return;
        router.delete(route('admin.attendances.destroy', selectedAttendance.id), {
            onSuccess: () => { setDeleteModal(false); setSelectedAttendance(null); }
        });
    };

    const data = attendances?.data ?? [];
    const links = attendances?.links ?? [];

    return (
        <AuthenticatedLayout header="Attendance Management">
            <Head title="Attendance" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Attendance Records</h1>
                        <Link href={route('admin.attendances.create')}><Button variant="primary">Add New Attendance</Button></Link>
                    </div>

                    {attendances?.flash?.success && <FlashMessage message={attendances.flash.success} type="success" />}
                    {attendances?.flash?.error && <FlashMessage message={attendances.flash.error} type="error" />}

                    <div className="mb-4 flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search Student</label>
                            <input type="text" placeholder="Student name..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleSearchKeyDown}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                        </div>
                        <div className="w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                            <select value={classId} onChange={e => { setClassId(e.target.value); setTimeout(applyFilters,0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                                <option value="">All Classes</option>
                                {classes?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select value={status} onChange={e => { setStatus(e.target.value); setTimeout(applyFilters,0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                                <option value="">All Statuses</option>
                                {statuses?.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                            </select>
                        </div>
                        <div className="w-40">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                            <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setTimeout(applyFilters,0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                        </div>
                        <div className="w-40">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                            <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setTimeout(applyFilters,0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                        </div>
                        <div className="w-56">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                            <select value={sort} onChange={e => { setSort(e.target.value); setTimeout(applyFilters,0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                                <option value="latest">Latest First</option>
                                <option value="date_asc">Date (Oldest first)</option>
                                <option value="date_desc">Date (Newest first)</option>
                                <option value="student_asc">Student (A-Z)</option>
                                <option value="student_desc">Student (Z-A)</option>
                            </select>
                        </div>
                        <Button variant="primary" onClick={applyFilters}>Apply Filters</Button>
                    </div>

                    <DataTable columns={columns} data={data} actions={true} onEdit={handleEdit} onDelete={handleDelete} />

                    {links.length > 3 && (
                        <div className="mt-6 flex justify-center flex-wrap">
                            {links.map((link, idx) => (
                                <span key={idx}>
                                    {link.url ? (
                                        <Link href={link.url} className={`px-3 py-1 mx-1 rounded text-sm ${link.active ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }} />
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
                    <p>Delete attendance for <strong>{selectedAttendance?.student?.user?.name}</strong> on {selectedAttendance && new Date(selectedAttendance.date).toLocaleDateString()}?</p>
                    <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="secondary" onClick={() => setDeleteModal(false)}>Cancel</Button>
                        <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
