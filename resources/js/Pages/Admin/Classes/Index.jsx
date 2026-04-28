import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ classes, gradeLevels, academicYears, filters = {} }) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);

    // Filter states
    const [search, setSearch] = useState(filters.search || '');
    const [gradeLevel, setGradeLevel] = useState(filters.grade_level || '');
    const [academicYear, setAcademicYear] = useState(filters.academic_year || '');
    const [sort, setSort] = useState(filters.sort || 'latest');

    const applyFilters = () => {
        router.get(route('admin.classes.index'), {
            search,
            grade_level: gradeLevel,
            academic_year: academicYear,
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
        { key: 'name', label: 'Class Name' },
        { key: 'grade_level', label: 'Grade Level' },
        { key: 'academic_year', label: 'Academic Year' },
        { key: 'section', label: 'Section' },
        { key: 'capacity', label: 'Capacity' },
        {
            key: 'teachers_count',
            label: 'Teachers',
            render: (item) => item.teachers_count ?? 0
        },
        {
            key: 'subjects_count',
            label: 'Subjects',
            render: (item) => item.subjects_count ?? 0
        },
    ];

    const handleEdit = (classItem) => {
        router.visit(route('admin.classes.edit', classItem.id));
    };

    const handleDelete = (classItem) => {
        setSelectedClass(classItem);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedClass) return;
        router.delete(route('admin.classes.destroy', selectedClass.id), {
            onSuccess: () => {
                setDeleteModal(false);
                setSelectedClass(null);
            }
        });
    };

    // Safe data extraction
    const classesData = Array.isArray(classes?.data) ? classes.data : [];
    const links = Array.isArray(classes?.links) ? classes.links : [];
    const gradeLevelsList = Array.isArray(gradeLevels) ? gradeLevels : [];
    const academicYearsList = Array.isArray(academicYears) ? academicYears : [];

    return (
        <AuthenticatedLayout header="Classes Management">
            <Head title="Classes" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-4 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Classes</h1>
                        <Link href={route('admin.classes.create')}>
                            <Button variant="primary">Add New Class</Button>
                        </Link>
                    </div>

                    {/* Flash Messages */}
                    {classes?.flash?.success && <FlashMessage message={classes.flash.success} type="success" />}
                    {classes?.flash?.error && <FlashMessage message={classes.flash.error} type="error" />}

                    {/* Filter Bar */}
                    <div className="mb-4 flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input
                                type="text"
                                placeholder="Name, grade, year, section..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            />
                        </div>
                        <div className="w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                            <select
                                value={gradeLevel}
                                onChange={(e) => {
                                    setGradeLevel(e.target.value);
                                    setTimeout(applyFilters, 0);
                                }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            >
                                <option value="">All Grades</option>
                                {gradeLevelsList.map((level) => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                            <select
                                value={academicYear}
                                onChange={(e) => {
                                    setAcademicYear(e.target.value);
                                    setTimeout(applyFilters, 0);
                                }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            >
                                <option value="">All Years</option>
                                {academicYearsList.map((year) => (
                                    <option key={year} value={year}>{year}</option>
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
                                <option value="grade_asc">Grade Level (A-Z)</option>
                                <option value="grade_desc">Grade Level (Z-A)</option>
                                <option value="capacity_asc">Capacity (Lowest)</option>
                                <option value="capacity_desc">Capacity (Highest)</option>
                                <option value="teachers_asc">Teachers (Lowest)</option>
                                <option value="teachers_desc">Teachers (Highest)</option>
                                <option value="subjects_asc">Subjects (Lowest)</option>
                                <option value="subjects_desc">Subjects (Highest)</option>
                            </select>
                        </div>
                        <div>
                            <Button variant="primary" onClick={applyFilters}>Apply Filters</Button>
                        </div>
                    </div>

                    {/* Data Table */}
                    <DataTable
                        columns={columns}
                        data={classesData}
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
                        Are you sure you want to delete class{' '}
                        <strong>{selectedClass?.name}</strong>?
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
