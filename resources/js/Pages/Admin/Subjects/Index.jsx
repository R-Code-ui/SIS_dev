import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ subjects, filters = {} }) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);

    // Filter states
    const [search, setSearch] = useState(filters.search || '');
    const [sort, setSort] = useState(filters.sort || 'latest');

    const applyFilters = () => {
        router.get(route('admin.subjects.index'), {
            search,
            sort,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') applyFilters();
    };

    const columns = [
        { key: 'code', label: 'Subject Code' },
        { key: 'name', label: 'Subject Name' },
        { key: 'credits', label: 'Credits' },
        { key: 'description', label: 'Description', render: (item) => item.description?.substring(0, 50) + (item.description?.length > 50 ? '…' : '') || '—' },
    ];

    const handleEdit = (subject) => {
        router.visit(route('admin.subjects.edit', subject.id));
    };

    const handleDelete = (subject) => {
        setSelectedSubject(subject);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedSubject) return;
        router.delete(route('admin.subjects.destroy', selectedSubject.id), {
            onSuccess: () => {
                setDeleteModal(false);
                setSelectedSubject(null);
            }
        });
    };

    // Safe data extraction
    const subjectsData = Array.isArray(subjects?.data) ? subjects.data : [];
    const links = Array.isArray(subjects?.links) ? subjects.links : [];

    return (
        <AuthenticatedLayout header="Subjects Management">
            <Head title="Subjects" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-4 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Subjects</h1>
                        <Link href={route('admin.subjects.create')}>
                            <Button variant="primary">Add New Subject</Button>
                        </Link>
                    </div>

                    {/* Flash Messages */}
                    {subjects?.flash?.success && <FlashMessage message={subjects.flash.success} type="success" />}
                    {subjects?.flash?.error && <FlashMessage message={subjects.flash.error} type="error" />}

                    {/* Filter Bar */}
                    <div className="mb-4 flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input
                                type="text"
                                placeholder="Subject name or code..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            />
                        </div>
                        <div className="w-56">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                            <select
                                value={sort}
                                onChange={(e) => {
                                    setSort(e.target.value);
                                    setTimeout(applyFilters, 0);
                                }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            >
                                <option value="latest">Latest First</option>
                                <option value="name_asc">Name (A-Z)</option>
                                <option value="name_desc">Name (Z-A)</option>
                                <option value="code_asc">Code (A-Z)</option>
                                <option value="code_desc">Code (Z-A)</option>
                                <option value="credits_asc">Credits (Lowest)</option>
                                <option value="credits_desc">Credits (Highest)</option>
                            </select>
                        </div>
                        <div>
                            <Button variant="primary" onClick={applyFilters}>Apply Filters</Button>
                        </div>
                    </div>

                    {/* Data Table */}
                    <DataTable
                        columns={columns}
                        data={subjectsData}
                        actions={true}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                    {/* Pagination */}
                    {links.length > 3 && (
                        <div className="mt-6 flex justify-center flex-wrap">
                            {links.map((link, idx) => (
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

            {/* Delete Modal */}
            <Modal show={deleteModal} onClose={() => setDeleteModal(false)} maxWidth="sm">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
                    <p className="text-gray-700">
                        Are you sure you want to delete subject{' '}
                        <strong>{selectedSubject?.name} ({selectedSubject?.code})</strong>?
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
