import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ guardians, occupations, filters = {} }) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedGuardian, setSelectedGuardian] = useState(null);

    // Filter states
    const [search, setSearch] = useState(filters.search || '');
    const [occupation, setOccupation] = useState(filters.occupation || '');
    const [sort, setSort] = useState(filters.sort || 'latest');

    const applyFilters = () => {
        router.get(route('admin.guardians.index'), {
            search,
            occupation,
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
        { key: 'name', label: 'Name', render: (item) => item.user?.name },
        { key: 'email', label: 'Email', render: (item) => item.user?.email },
        { key: 'phone', label: 'Phone' },
        { key: 'occupation', label: 'Occupation' },
        {
            key: 'students_count',
            label: 'Linked Students',
            render: (item) => item.students_count ?? 0
        },
    ];

    const handleEdit = (guardian) => {
        router.visit(route('admin.guardians.edit', guardian.id));
    };

    const handleDelete = (guardian) => {
        setSelectedGuardian(guardian);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedGuardian) return;
        router.delete(route('admin.guardians.destroy', selectedGuardian.id), {
            onSuccess: () => {
                setDeleteModal(false);
                setSelectedGuardian(null);
            }
        });
    };

    // Safe data extraction
    const guardiansData = Array.isArray(guardians?.data) ? guardians.data : [];
    const links = Array.isArray(guardians?.links) ? guardians.links : [];
    const occupationsList = Array.isArray(occupations) ? occupations : [];

    return (
        <AuthenticatedLayout header="Guardians Management">
            <Head title="Guardians" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-4 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Guardians</h1>
                        <Link href={route('admin.guardians.create')}>
                            <Button variant="primary">Add New Guardian</Button>
                        </Link>
                    </div>

                    {/* Flash Messages */}
                    {guardians?.flash?.success && <FlashMessage message={guardians.flash.success} type="success" />}
                    {guardians?.flash?.error && <FlashMessage message={guardians.flash.error} type="error" />}

                    {/* Filter Bar */}
                    <div className="mb-4 flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input
                                type="text"
                                placeholder="Name, email, phone or occupation..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            />
                        </div>
                        <div className="w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                            <select
                                value={occupation}
                                onChange={(e) => {
                                    setOccupation(e.target.value);
                                    setTimeout(applyFilters, 0);
                                }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            >
                                <option value="">All Occupations</option>
                                {occupationsList.map((occ) => (
                                    <option key={occ} value={occ}>{occ}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-64">
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
                                <option value="email_asc">Email (A-Z)</option>
                                <option value="email_desc">Email (Z-A)</option>
                                <option value="occupation_asc">Occupation (A-Z)</option>
                                <option value="occupation_desc">Occupation (Z-A)</option>
                                <option value="students_asc">Linked Students (Lowest first)</option>
                                <option value="students_desc">Linked Students (Highest first)</option>
                            </select>
                        </div>
                        <div>
                            <Button variant="primary" onClick={applyFilters}>Apply Filters</Button>
                        </div>
                    </div>

                    {/* Data Table */}
                    <DataTable
                        columns={columns}
                        data={guardiansData}
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
                        Are you sure you want to delete guardian{' '}
                        <strong>{selectedGuardian?.user?.name}</strong>?
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
