import TeacherLayout from '@/Layouts/TeacherLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ exams, classes, filters }) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedExam, setSelectedExam] = useState(null);

    let safeFilters = {};
    if (filters && typeof filters === 'object' && !Array.isArray(filters)) {
        safeFilters = filters;
    }

    const [search, setSearch] = useState(safeFilters.search || '');
    const [classId, setClassId] = useState(safeFilters.class_id || '');
    const [sort, setSort] = useState(safeFilters.sort || 'date_asc');

    const applyFilters = () => {
        router.get(route('teacher.exams.index'), {
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
        { key: 'title', label: 'Exam Title' },
        { key: 'class', label: 'Class', render: (item) => item.class?.name || '—' },
        { key: 'subject', label: 'Subject', render: (item) => item.subject?.name || '—' },
        { key: 'date', label: 'Date', render: (item) => new Date(item.date).toLocaleDateString() },
        { key: 'max_marks', label: 'Max Marks' },
        { key: 'passing_marks', label: 'Passing Marks' },
    ];

    const handleEdit = (exam) => {
        router.visit(route('teacher.exams.edit', exam.id));
    };

    const handleDelete = (exam) => {
        setSelectedExam(exam);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedExam) return;
        router.delete(route('teacher.exams.destroy', selectedExam.id), {
            onSuccess: () => {
                setDeleteModal(false);
                setSelectedExam(null);
            }
        });
    };

    const examsData = exams?.data && Array.isArray(exams.data) ? exams.data : [];
    const links = exams?.links && Array.isArray(exams.links) ? exams.links : [];
    const classesList = Array.isArray(classes) ? classes : [];

    return (
        <TeacherLayout header="My Exams">
            <Head title="Exams" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">My Exams</h1>
                        <Button variant="primary" onClick={() => router.visit(route('teacher.exams.create'))}>
                            Add New Exam
                        </Button>
                    </div>

                    {exams?.flash?.success && <FlashMessage message={exams.flash.success} type="success" />}
                    {exams?.flash?.error && <FlashMessage message={exams.flash.error} type="error" />}

                    <div className="mb-4 flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input
                                type="text"
                                placeholder="Exam title..."
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
                                <option value="date_asc">Earliest First</option>
                                <option value="date_desc">Latest First</option>
                                <option value="title_asc">Title (A-Z)</option>
                                <option value="title_desc">Title (Z-A)</option>
                            </select>
                        </div>
                        <Button variant="primary" onClick={applyFilters}>Apply Filters</Button>
                    </div>

                    <DataTable
                        columns={columns}
                        data={examsData}
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
                    <p>Are you sure you want to delete exam <strong>{selectedExam?.title}</strong>?</p>
                    <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="secondary" onClick={() => setDeleteModal(false)}>Cancel</Button>
                        <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </TeacherLayout>
    );
}
