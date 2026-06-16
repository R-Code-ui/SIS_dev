import TeacherLayout from '@/Layouts/TeacherLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ assignments, classes, filters }) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    let safeFilters = {};
    if (filters && typeof filters === 'object' && !Array.isArray(filters)) {
        safeFilters = filters;
    }

    const [search, setSearch] = useState(safeFilters.search || '');
    const [classId, setClassId] = useState(safeFilters.class_id || '');
    const [sort, setSort] = useState(safeFilters.sort || 'due_date_asc');

    const applyFilters = () => {
        router.get(route('teacher.assignments.index'), {
            search,
            class_id: classId,
            sort,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchKeyDown = (e) => e.key === 'Enter' && applyFilters();

    const columns = [
        { key: 'title', label: 'Title' },
        { key: 'class', label: 'Class', render: (item) => item.class?.name || '—' },
        { key: 'subject', label: 'Subject', render: (item) => item.subject?.name || '—' },
        { key: 'due_date', label: 'Due Date', render: (item) => new Date(item.due_date).toLocaleDateString() },
        { key: 'file_path', label: 'Attachment', render: (item) => item.file_path ? '📎 Yes' : '—' },
    ];

    const handleEdit = (assignment) => {
        router.visit(route('teacher.assignments.edit', assignment.id));
    };

    const handleDelete = (assignment) => {
        setSelectedAssignment(assignment);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedAssignment) return;
        router.delete(route('teacher.assignments.destroy', selectedAssignment.id), {
            onSuccess: () => {
                setDeleteModal(false);
                setSelectedAssignment(null);
            }
        });
    };

    const assignmentsData = assignments?.data && Array.isArray(assignments.data) ? assignments.data : [];
    const links = assignments?.links && Array.isArray(assignments.links) ? assignments.links : [];
    const classesList = Array.isArray(classes) ? classes : [];

    return (
        <TeacherLayout header="My Assignments">
            <Head title="Assignments" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">My Assignments</h1>
                        <Button variant="primary" onClick={() => router.visit(route('teacher.assignments.create'))}>
                            Add New Assignment
                        </Button>
                    </div>

                    {assignments?.flash?.success && <FlashMessage message={assignments.flash.success} type="success" />}
                    {assignments?.flash?.error && <FlashMessage message={assignments.flash.error} type="error" />}

                    <div className="mb-4 flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input
                                type="text"
                                placeholder="Assignment title..."
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
                        <div className="w-56">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                            <select
                                value={sort}
                                onChange={(e) => { setSort(e.target.value); setTimeout(applyFilters, 0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            >
                                <option value="due_date_asc">Due Date (Earliest)</option>
                                <option value="due_date_desc">Due Date (Latest)</option>
                                <option value="title_asc">Title (A-Z)</option>
                                <option value="title_desc">Title (Z-A)</option>
                            </select>
                        </div>
                        <Button variant="primary" onClick={applyFilters}>Apply Filters</Button>
                    </div>

                    <DataTable
                        columns={columns}
                        data={assignmentsData}
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
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            onClick={(e) => { e.preventDefault(); router.get(link.url, {}, { preserveState: true, preserveScroll: true }); }}
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
                    <p>Are you sure you want to delete assignment <strong>{selectedAssignment?.title}</strong>?</p>
                    <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="secondary" onClick={() => setDeleteModal(false)}>Cancel</Button>
                        <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </TeacherLayout>
    );
}
