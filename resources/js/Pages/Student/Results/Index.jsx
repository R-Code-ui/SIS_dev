import StudentLayout from '@/Layouts/StudentLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ results, exams, subjects, filters }) {
    const safeFilters = filters || {};
    const [search, setSearch] = useState(safeFilters.search || '');
    const [examId, setExamId] = useState(safeFilters.exam_id || '');
    const [subjectId, setSubjectId] = useState(safeFilters.subject_id || '');
    const [sort, setSort] = useState(safeFilters.sort || 'latest');

    const applyFilters = () => {
        router.get(route('student.results.index'), {
            search,
            exam_id: examId,
            subject_id: subjectId,
            sort,
        }, { preserveState: true, preserveScroll: true });
    };

    const handleSearchKeyDown = (e) => e.key === 'Enter' && applyFilters();

    const columns = [
        { key: 'exam_title', label: 'Exam', render: (item) => item.exam?.title || '—' },
        { key: 'subject_name', label: 'Subject', render: (item) => item.subject?.name || '—' },
        { key: 'marks_obtained', label: 'Marks Obtained' },
        { key: 'grade', label: 'Grade' },
        { key: 'remarks', label: 'Remarks', render: (item) => item.remarks || '—' },
        { key: 'date', label: 'Date', render: (item) => item.exam ? new Date(item.exam.date).toLocaleDateString() : '—' },
    ];

    const data = results?.data || [];
    const links = results?.links || [];

    return (
        <StudentLayout header="My Results">
            <Head title="Results" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-4">My Results</h1>

                    <div className="mb-4 flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input
                                type="text"
                                placeholder="Exam or subject..."
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
                        <div className="w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <select
                                value={subjectId}
                                onChange={(e) => { setSubjectId(e.target.value); setTimeout(applyFilters, 0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            >
                                <option value="">All Subjects</option>
                                {subjects?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="w-56">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                            <select
                                value={sort}
                                onChange={(e) => { setSort(e.target.value); setTimeout(applyFilters, 0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            >
                                <option value="latest">Latest First</option>
                                <option value="exam_asc">Exam (A-Z)</option>
                                <option value="exam_desc">Exam (Z-A)</option>
                                <option value="subject_asc">Subject (A-Z)</option>
                                <option value="subject_desc">Subject (Z-A)</option>
                                <option value="marks_asc">Marks (Lowest first)</option>
                                <option value="marks_desc">Marks (Highest first)</option>
                            </select>
                        </div>
                        <Button variant="primary" onClick={applyFilters}>Apply Filters</Button>
                    </div>

                    <DataTable columns={columns} data={data} actions={false} />

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
        </StudentLayout>
    );
}
