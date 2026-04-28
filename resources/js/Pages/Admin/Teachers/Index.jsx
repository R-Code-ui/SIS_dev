import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ teachers, departments, filters = {} }) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    // Filters state
    const [search, setSearch] = useState(filters.search || '');
    const [department, setDepartment] = useState(filters.department || '');
    const [sort, setSort] = useState(filters.sort || 'latest');

    // Apply filters (reload page with query string)
    const applyFilters = () => {
        router.get(route('admin.teachers.index'), {
            search,
            department,
            sort,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Handle enter key in search
    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') applyFilters();
    };

    const columns = [
        { key: 'employee_id', label: 'Employee ID' },
        { key: 'name', label: 'Name', render: (item) => item.user?.name },
        { key: 'email', label: 'Email', render: (item) => item.user?.email },
        { key: 'department', label: 'Department' },
        { key: 'phone', label: 'Phone' },
    ];

    const handleEdit = (teacher) => {
        router.visit(route('admin.teachers.edit', teacher.id));
    };

    const handleDelete = (teacher) => {
        setSelectedTeacher(teacher);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedTeacher) return;
        router.delete(route('admin.teachers.destroy', selectedTeacher.id), {
            onSuccess: () => {
                setDeleteModal(false);
                setSelectedTeacher(null);
            }
        });
    };

    // Safe data extraction
    const teachersData = Array.isArray(teachers?.data) ? teachers.data : [];
    const links = Array.isArray(teachers?.links) ? teachers.links : [];

    return (
        <AuthenticatedLayout header="Teachers Management">
            <Head title="Teachers" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-4 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Teachers</h1>
                        <Link href={route('admin.teachers.create')}>
                            <Button variant="primary">Add New Teacher</Button>
                        </Link>
                    </div>

                    {/* Flash Messages */}
                    {teachers?.flash?.success && <FlashMessage message={teachers.flash.success} type="success" />}
                    {teachers?.flash?.error && <FlashMessage message={teachers.flash.error} type="error" />}

                    {/* Filters Bar */}
                    <div className="mb-4 flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input
                                type="text"
                                placeholder="Name, email or employee ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            />
                        </div>
                        <div className="w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <select
                                value={department}
                                onChange={(e) => {
                                    setDepartment(e.target.value);
                                    setTimeout(applyFilters, 0);
                                }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            >
                                <option value="">All Departments</option>
                                {departments?.map((dept) => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
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
                                <option value="employee_asc">Employee ID (Asc)</option>
                                <option value="employee_desc">Employee ID (Desc)</option>
                            </select>
                        </div>
                        <div>
                            <Button variant="primary" onClick={applyFilters}>Apply Filters</Button>
                        </div>
                    </div>

                    {/* Data Table */}
                    <DataTable
                        columns={columns}
                        data={teachersData}
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
                        Are you sure you want to delete teacher{' '}
                        <strong>{selectedTeacher?.user?.name}</strong>?
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
