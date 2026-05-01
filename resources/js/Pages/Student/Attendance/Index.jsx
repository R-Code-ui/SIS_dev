import StudentLayout from '@/Layouts/StudentLayout';
import Button from '@/Components/Button';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ overallPercentage, monthlyData, filters }) {
    const [month, setMonth] = useState(filters.month || '');

    const applyFilters = () => {
        router.get(route('student.attendances.index'), { month }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 90) return 'bg-green-500';
        if (percentage >= 75) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <StudentLayout header="My Attendance">
            <Head title="Attendance" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-6">Attendance Overview</h1>

                    {/* Overall Percentage Card */}
                    <div className="bg-white shadow rounded-lg p-6 mb-8">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Overall Attendance</h2>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-3xl font-bold text-gray-900">{overallPercentage}%</span>
                            <span className="text-sm text-gray-500">of all class days</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className={`${getProgressColor(overallPercentage)} h-4 rounded-full transition-all duration-500`}
                                style={{ width: `${overallPercentage}%` }}
                            />
                        </div>
                    </div>

                    {/* Monthly Breakdown */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                            <h2 className="text-lg font-medium text-gray-900">Monthly Breakdown</h2>
                            <div className="flex gap-2">
                                <input
                                    type="month"
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                />
                                <Button variant="primary" onClick={applyFilters}>Filter</Button>
                                {month && (
                                    <Button variant="secondary" onClick={() => {
                                        setMonth('');
                                        router.get(route('student.attendances.index'), {}, { preserveState: true, preserveScroll: true });
                                    }}>
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </div>

                        {monthlyData.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Days</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trend</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {monthlyData.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(item.month + '-01').toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {item.present}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {item.total}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                    {item.percentage}%
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`${getProgressColor(item.percentage)} h-2 rounded-full`}
                                                            style={{ width: `${item.percentage}%` }}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No attendance records found.</p>
                        )}
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
