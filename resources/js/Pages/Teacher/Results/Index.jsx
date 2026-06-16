import TeacherLayout from '@/Layouts/TeacherLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ results, exams, filters }) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedResult, setSelectedResult] = useState(null);

    let safeFilters = {};
    if (filters && typeof filters === 'object' && !Array.isArray(filters)) {
        safeFilters = filters;
    }

    const [search, setSearch] = useState(safeFilters.search || '');
    const [examId, setExamId] = useState(safeFilters.exam_id || '');
    const [sort, setSort] = useState(safeFilters.sort || 'student_name_asc');

    const applyFilters = () => {
        router.get(route('teacher.results.index'), {
            search,
            exam_id: examId,
            sort,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchKeyDown = (e) => e.key === 'Enter' && applyFilters();

    const columns = [
        { key: 'student', label: 'Student', render: (item) => item.student?.user?.name || '—' },
        { key: 'exam', label: 'Exam', render: (item) => item.exam?.title || '—' },
        { key: 'subject', label: 'Subject', render: (item) => item.subject?.name || '—' },
        { key: 'marks_obtained', label: 'Marks' },
        { key: 'grade', label: 'Grade' },
        { key: 'remarks', label: 'Remarks', render: (item) => item.remarks || '—' },
    ];

    const handleEdit = (result) => {
        router.visit(route('teacher.results.edit', result.id));
    };

    const handleDelete = (result) => {
        setSelectedResult(result);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedResult) return;
        router.delete(route('teacher.results.destroy', selectedResult.id), {
            onSuccess: () => {
                setDeleteModal(false);
                setSelectedResult(null);
            }
        });
    };

    const resultsData = results?.data && Array.isArray(results.data) ? results.data : [];
    const links = results?.links && Array.isArray(results.links) ? results.links : [];

    return (
        <TeacherLayout header="Results">
            <Head title="Results" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Results</h1>
                        <Button variant="primary" onClick={() => router.visit(route('teacher.results.create'))}>
                            Add New Result
                        </Button>
                    </div>

                    {results?.flash?.success && <FlashMessage message={results.flash.success} type="success" />}
                    {results?.flash?.error && <FlashMessage message={results.flash.error} type="error" />}

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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Exam</label>
                            <select
                                value={examId}
                                onChange={(e) => { setExamId(e.target.value); setTimeout(applyFilters, 0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            >
                                <option value="">All Exams</option>
                                {exams?.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                            </select>
                        </div>
                        <div className="w-56">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                            <select
                                value={sort}
                                onChange={(e) => { setSort(e.target.value); setTimeout(applyFilters, 0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            >
                                <option value="student_name_asc">Student (A-Z)</option>
                                <option value="student_name_desc">Student (Z-A)</option>
                            </select>
                        </div>
                        <Button variant="primary" onClick={applyFilters}>Apply Filters</Button>
                    </div>

                    <DataTable
                        columns={columns}
                        data={resultsData}
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
                    <p>Are you sure you want to delete this result?</p>
                    <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="secondary" onClick={() => setDeleteModal(false)}>Cancel</Button>
                        <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </TeacherLayout>
    );
}
