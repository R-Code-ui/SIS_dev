import StudentLayout from '@/Layouts/StudentLayout';
import { Head } from '@inertiajs/react';

export default function Index({ class: classInfo, weeklySchedule, error }) {
    return (
        <StudentLayout header="My Class & Timetable">
            <Head title="My Class" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {error ? (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                            <p className="text-yellow-700">{error}</p>
                        </div>
                    ) : (
                        <>
                            {/* Class Information Card */}
                            <div className="bg-white shadow rounded-lg p-6 mb-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Class Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><span className="font-medium">Class Name:</span> {classInfo?.name}</div>
                                    <div><span className="font-medium">Grade Level:</span> {classInfo?.grade_level}</div>
                                    <div><span className="font-medium">Section:</span> {classInfo?.section || '—'}</div>
                                    <div><span className="font-medium">Academic Year:</span> {classInfo?.academic_year}</div>
                                    <div><span className="font-medium">Capacity:</span> {classInfo?.capacity}</div>
                                </div>
                            </div>

                            {/* Weekly Timetable */}
                            <div className="bg-white shadow rounded-lg p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Timetable</h2>
                                {Object.keys(weeklySchedule).length === 0 || Object.values(weeklySchedule).every(day => day.length === 0) ? (
                                    <p className="text-gray-500 text-center py-4">No lessons scheduled yet.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Time</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Time</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {Object.entries(weeklySchedule).map(([day, lessons]) => (
                                                    lessons.length > 0 ? (
                                                        lessons.map((lesson, idx) => (
                                                            <tr key={`${day}-${idx}`} className="hover:bg-gray-50">
                                                                {idx === 0 && (
                                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900" rowSpan={lessons.length}>
                                                                        {day}
                                                                    </td>
                                                                )}
                                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                                    {lesson.start_time ? lesson.start_time.substring(0, 5) : '—'}
                                                                </td>
                                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                                    {lesson.end_time ? lesson.end_time.substring(0, 5) : '—'}
                                                                </td>
                                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                                    {lesson.subject?.name || '—'}
                                                                </td>
                                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                                    {lesson.teacher?.user?.name || '—'}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr key={day}>
                                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{day}</td>
                                                            <td colSpan="4" className="px-4 py-3 text-sm text-gray-500">No lessons</td>
                                                        </tr>
                                                    )
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </StudentLayout>
    );
}
