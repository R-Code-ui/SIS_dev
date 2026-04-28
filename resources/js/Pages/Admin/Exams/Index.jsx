import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ exams, classes, subjects, filters = {} }) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedExam, setSelectedExam] = useState(null);

    const [search, setSearch] = useState(filters.search || '');
    const [classId, setClassId] = useState(filters.class_id || '');
    const [subjectId, setSubjectId] = useState(filters.subject_id || '');
    const [sort, setSort] = useState(filters.sort || 'latest');

    const applyFilters = () => {
        router.get(route('admin.exams.index'), { search, class_id: classId, subject_id: subjectId, sort },
            { preserveState: true, preserveScroll: true });
    };
    const handleSearchKeyDown = (e) => e.key === 'Enter' && applyFilters();

    const columns = [
        { key: 'title', label: 'Exam Title' },
        { key: 'class', label: 'Class', render: (item) => item.class?.name || '—' },
        { key: 'subject', label: 'Subject', render: (item) => item.subject?.name || '—' },
        { key: 'date', label: 'Date', render: (item) => new Date(item.date).toLocaleDateString() },
        { key: 'max_marks', label: 'Max Marks' },
        { key: 'passing_marks', label: 'Passing Marks' },
    ];

    const handleEdit = (exam) => router.visit(route('admin.exams.edit', exam.id));
    const handleDelete = (exam) => { setSelectedExam(exam); setDeleteModal(true); };
    const confirmDelete = () => {
        if (!selectedExam) return;
        router.delete(route('admin.exams.destroy', selectedExam.id), {
            onSuccess: () => { setDeleteModal(false); setSelectedExam(null); }
        });
    };

    const examsData = exams?.data ?? [];
    const links = exams?.links ?? [];

    return (
        <AuthenticatedLayout header="Exams Management">
            <Head title="Exams" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Exams</h1>
                        <Link href={route('admin.exams.create')}><Button variant="primary">Add New Exam</Button></Link>
                    </div>

                    {exams?.flash?.success && <FlashMessage message={exams.flash.success} type="success" />}
                    {exams?.flash?.error && <FlashMessage message={exams.flash.error} type="error" />}

                    <div className="mb-4 flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input type="text" placeholder="Title, class, subject..." value={search}
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
                        <div className="w-56">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                            <select value={sort} onChange={(e) => { setSort(e.target.value); setTimeout(applyFilters,0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                                <option value="latest">Latest First</option>
                                <option value="title_asc">Title (A-Z)</option>
                                <option value="title_desc">Title (Z-A)</option>
                                <option value="date_asc">Date (Oldest first)</option>
                                <option value="date_desc">Date (Newest first)</option>
                                <option value="max_marks_asc">Max Marks (Lowest)</option>
                                <option value="max_marks_desc">Max Marks (Highest)</option>
                            </select>
                        </div>
                        <Button variant="primary" onClick={applyFilters}>Apply Filters</Button>
                    </div>

                    <DataTable columns={columns} data={examsData} actions={true} onEdit={handleEdit} onDelete={handleDelete} />

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
                    <p>Are you sure you want to delete exam <strong>{selectedExam?.title}</strong>?</p>
                    <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="secondary" onClick={() => setDeleteModal(false)}>Cancel</Button>
                        <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
