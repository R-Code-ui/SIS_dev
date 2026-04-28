import TeacherLayout from '@/Layouts/TeacherLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ students, classes, filters }) {
    // ✅ SAFE FILTERS
    const safeFilters = (filters && typeof filters === 'object') ? filters : {};

    const [search, setSearch] = useState(safeFilters.search || '');
    const [classId, setClassId] = useState(safeFilters.class_id || '');
    const [sortValue, setSortValue] = useState(safeFilters.sort || 'name_asc');

    // ✅ APPLY FILTERS
    const applyFilters = () => {
        router.get(route('teacher.students.index'), {
            search,
            class_id: classId,
            sort: sortValue,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // ✅ SAFE DATA
    const studentsData = Array.isArray(students?.data) ? students.data : [];
    const links = Array.isArray(students?.links) ? students.links : [];
    const classesList = Array.isArray(classes) ? classes : [];

    // ✅ TABLE COLUMNS
    const columns = [
        { key: 'admission_no', label: 'Admission No' },
        { key: 'name', label: 'Name', render: (item) => item?.user?.name || '-' },
        { key: 'email', label: 'Email', render: (item) => item?.user?.email || '-' },
        { key: 'roll_number', label: 'Roll No' },
        { key: 'class', label: 'Class', render: (item) => item?.class?.name || 'Not Assigned' },
    ];

    return (
        <TeacherLayout header="Students">
            <Head title="Students" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    <div className="mb-4">
                        <h1 className="text-2xl font-semibold text-gray-900">My Students</h1>
                    </div>

                    {/* ✅ FILTER BAR */}
                    <div className="mb-4 flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow">

                        {/* SEARCH */}
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input
                                type="text"
                                placeholder="Name or Admission No..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            />
                        </div>

                        {/* ✅ CLASS FILTER (FIXED) */}
                        <div className="w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                            <select
                                value={classId}
                                onChange={(e) => {
                                    setClassId(e.target.value);
                                    setTimeout(applyFilters, 0);
                                }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            >
                                <option value="">All Classes</option>
                                {classesList.map((cls) => (
                                    <option key={cls.id} value={cls.id}>
                                        {cls.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* ✅ SORT FILTER (FIXED) */}
                        <div className="w-56">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                            <select
                                value={sortValue}
                                onChange={(e) => {
                                    setSortValue(e.target.value);
                                    setTimeout(applyFilters, 0);
                                }}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            >
                                <option value="name_asc">Name (A-Z)</option>
                                <option value="name_desc">Name (Z-A)</option>
                                <option value="admission_asc">Admission No (Asc)</option>
                                <option value="admission_desc">Admission No (Desc)</option>
                            </select>
                        </div>

                        {/* APPLY BUTTON */}
                        <div>
                            <Button variant="primary" onClick={applyFilters}>
                                Apply Filters
                            </Button>
                        </div>
                    </div>

                    {/* ✅ TABLE */}
                    <DataTable
                        columns={columns}
                        data={studentsData}
                        actions={false}
                    />

                    {/* ✅ PAGINATION */}
                    {links.length > 3 && (
                        <div className="mt-6 flex justify-center flex-wrap">
                            {links.map((link, idx) => (
                                <span key={idx}>
                                    {link.url ? (
                                        <a
                                            href={link.url}
                                            className={`px-3 py-1 mx-1 rounded text-sm ${
                                                link.active
                                                    ? 'bg-green-700 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.get(link.url, {}, {
                                                    preserveState: true,
                                                    preserveScroll: true
                                                });
                                            }}
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
        </TeacherLayout>
    );
}
