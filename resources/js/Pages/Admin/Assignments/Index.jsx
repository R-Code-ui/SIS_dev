import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ assignments, classes, subjects, teachers, filters = {} }) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    const [search, setSearch] = useState(filters.search || '');
    const [classId, setClassId] = useState(filters.class_id || '');
    const [subjectId, setSubjectId] = useState(filters.subject_id || '');
    const [teacherId, setTeacherId] = useState(filters.teacher_id || '');
    const [sort, setSort] = useState(filters.sort || 'latest');

    const applyFilters = () => {
        router.get(route('admin.assignments.index'), { search, class_id: classId, subject_id: subjectId, teacher_id: teacherId, sort },
            { preserveState: true, preserveScroll: true });
    };
    const handleSearchKeyDown = (e) => e.key === 'Enter' && applyFilters();

    const columns = [
        { key: 'title', label: 'Title' },
        { key: 'class', label: 'Class', render: (item) => item.class?.name || '—' },
        { key: 'subject', label: 'Subject', render: (item) => item.subject?.name || '—' },
        { key: 'teacher', label: 'Teacher', render: (item) => item.teacher?.user?.name || '—' },
        { key: 'due_date', label: 'Due Date', render: (item) => new Date(item.due_date).toLocaleDateString() },
        { key: 'file_path', label: 'Attachment', render: (item) => item.file_path ? '📎 Yes' : '—' },
    ];

    const handleEdit = (assignment) => router.visit(route('admin.assignments.edit', assignment.id));
    const handleDelete = (assignment) => { setSelectedAssignment(assignment); setDeleteModal(true); };
    const confirmDelete = () => {
        if (!selectedAssignment) return;
        router.delete(route('admin.assignments.destroy', selectedAssignment.id), {
            onSuccess: () => { setDeleteModal(false); setSelectedAssignment(null); }
        });
    };

    const data = assignments?.data ?? [];

    return (
        <AuthenticatedLayout header="Assignments Management">
            <Head title="Assignments" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Assignments</h1>
                        <Link href={route('admin.assignments.create')}><Button variant="primary">Add New Assignment</Button></Link>
                    </div>

                    {assignments?.flash?.success && <FlashMessage message={assignments.flash.success} type="success" />}
                    {assignments?.flash?.error && <FlashMessage message={assignments.flash.error} type="error" />}

                    <div className="mb-4 flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input type="text" placeholder="Title, class, subject, teacher..." value={search}
                                onChange={(e) => setSearch(e.target.value)} onKeyDown={handleSearchKeyDown}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                        </div>
                        <div className="w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                            <select value={classId} onChange={(e) => { setClassId(e.target.value); setTimeout(applyFilters,0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                                <option value="">All Classes</option>
                                {classes?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <select value={subjectId} onChange={(e) => { setSubjectId(e.target.value); setTimeout(applyFilters,0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                                <option value="">All Subjects</option>
                                {subjects?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
                            <select value={teacherId} onChange={(e) => { setTeacherId(e.target.value); setTimeout(applyFilters,0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                                <option value="">All Teachers</option>
                                {teachers?.map(t => <option key={t.id} value={t.id}>{t.user?.name}</option>)}
                            </select>
                        </div>
                        <div className="w-56">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                            <select value={sort} onChange={(e) => { setSort(e.target.value); setTimeout(applyFilters,0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                                <option value="latest">Latest First</option>
                                <option value="title_asc">Title (A-Z)</option>
                                <option value="title_desc">Title (Z-A)</option>
                                <option value="due_date_asc">Due Date (Earliest)</option>
                                <option value="due_date_desc">Due Date (Latest)</option>
                            </select>
                        </div>
                        <Button variant="primary" onClick={applyFilters}>Apply Filters</Button>
                    </div>

                    <DataTable columns={columns} data={data} actions={true} onEdit={handleEdit} onDelete={handleDelete} />

                    {assignments?.links?.length > 3 && (
                        <div className="mt-6 flex justify-center flex-wrap">
                            {assignments.links.map((link, idx) => (
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
                    <p>Are you sure you want to delete assignment <strong>{selectedAssignment?.title}</strong>?</p>
                    <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="secondary" onClick={() => setDeleteModal(false)}>Cancel</Button>
                        <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
