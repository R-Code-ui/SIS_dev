import StudentLayout from '@/Layouts/StudentLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ assignments, subjects, filters }) {
    const safeFilters = filters || {};
    const [search, setSearch] = useState(safeFilters.search || '');
    const [subjectId, setSubjectId] = useState(safeFilters.subject_id || '');
    const [status, setStatus] = useState(safeFilters.status || '');
    const [sort, setSort] = useState(safeFilters.sort || 'latest');

    const applyFilters = () => {
        router.get(route('student.assignments.index'), {
            search, subject_id: subjectId, status, sort,
        }, { preserveState: true, preserveScroll: true });
    };

    const handleSearchKeyDown = (e) => e.key === 'Enter' && applyFilters();

    const columns = [
        { key: 'title', label: 'Title' },
        { key: 'subject', label: 'Subject', render: (item) => item.subject?.name || '—' },
        { key: 'teacher', label: 'Teacher', render: (item) => item.teacher?.user?.name || '—' },
        { key: 'due_date', label: 'Due Date', render: (item) => new Date(item.due_date).toLocaleDateString() },
        {
            key: 'status_display',
            label: 'Status',
            render: (item) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.submissions_exists ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {item.submissions_exists ? 'Submitted' : 'Pending'}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (item) => (
                <Button variant="primary" onClick={() => router.visit(route('student.assignments.show', item.id))}>
                    View
                </Button>
            )
        },
    ];

    const data = assignments?.data || [];
    const links = assignments?.links || [];

    return (
        <StudentLayout header="My Assignments">
            <Head title="Assignments" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-4">Assignments</h1>

                    <div className="mb-4 flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input type="text" placeholder="Title..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleSearchKeyDown}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                        </div>
                        <div className="w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <select value={subjectId} onChange={e => { setSubjectId(e.target.value); setTimeout(applyFilters, 0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                                <option value="">All Subjects</option>
                                {subjects?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select value={status} onChange={e => { setStatus(e.target.value); setTimeout(applyFilters, 0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                                <option value="">All</option>
                                <option value="pending">Pending</option>
                                <option value="submitted">Submitted</option>
                            </select>
                        </div>
                        <div className="w-56">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                            <select value={sort} onChange={e => { setSort(e.target.value); setTimeout(applyFilters, 0); }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                                <option value="latest">Newest First</option>
                                <option value="due_asc">Due Date (Earliest)</option>
                                <option value="due_desc">Due Date (Latest)</option>
                                <option value="title_asc">Title (A-Z)</option>
                                <option value="title_desc">Title (Z-A)</option>
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
                                        <a href={link.url} className={`px-3 py-1 mx-1 rounded text-sm ${link.active ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                            onClick={(e) => { e.preventDefault(); router.get(link.url, {}, { preserveState: true, preserveScroll: true }); }}
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
        </StudentLayout>
    );
}
