import StudentLayout from '@/Layouts/StudentLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ upcomingExams, pendingAssignments, attendanceRate, latestAnnouncements, upcomingEvents }) {
    const StatCard = ({ title, value, icon, color }) => (
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
            <div className={`p-3 rounded-full ${color}`}>{icon}</div>
        </div>
    );

    return (
        <StudentLayout header="Student Dashboard">
            <Head title="Dashboard" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Stats cards */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                        <StatCard title="Attendance Rate" value={`${attendanceRate}%`} icon="📊" color="bg-blue-100 text-blue-600" />
                        <StatCard title="Upcoming Exams" value={upcomingExams.length} icon="📝" color="bg-yellow-100 text-yellow-600" />
                        <StatCard title="Pending Assignments" value={pendingAssignments.length} icon="📄" color="bg-purple-100 text-purple-600" />
                    </div>

                    {/* Two columns: Upcoming Exams & Pending Assignments */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Exams</h3>
                            {upcomingExams.length > 0 ? (
                                <ul className="divide-y divide-gray-200">
                                    {upcomingExams.map((exam) => (
                                        <li key={exam.id} className="py-3">
                                            <p className="font-medium text-gray-900">{exam.title}</p>
                                            <p className="text-sm text-gray-600">{exam.subject?.name}</p>
                                            <p className="text-xs text-gray-500">{new Date(exam.date).toLocaleDateString()}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm">No upcoming exams.</p>
                            )}
                        </div>

                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Assignments</h3>
                            {pendingAssignments.length > 0 ? (
                                <ul className="divide-y divide-gray-200">
                                    {pendingAssignments.map((assignment) => (
                                        <li key={assignment.id} className="py-3">
                                            <p className="font-medium text-gray-900">{assignment.title}</p>
                                            <p className="text-sm text-gray-600">{assignment.subject?.name}</p>
                                            <p className="text-xs text-gray-500">Due: {new Date(assignment.due_date).toLocaleDateString()}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm">No pending assignments.</p>
                            )}
                        </div>
                    </div>

                    {/* Announcements & Events */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Latest Announcements</h3>
                            {latestAnnouncements.length > 0 ? (
                                <ul className="divide-y divide-gray-200">
                                    {latestAnnouncements.map((ann) => (
                                        <li key={ann.id} className="py-3">
                                            <p className="font-medium text-gray-900">{ann.title}</p>
                                            <p className="text-sm text-gray-600">{ann.content.substring(0, 100)}...</p>
                                            <p className="text-xs text-gray-400">{new Date(ann.created_at).toLocaleDateString()}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm">No announcements.</p>
                            )}
                        </div>

                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Events</h3>
                            {upcomingEvents.length > 0 ? (
                                <ul className="divide-y divide-gray-200">
                                    {upcomingEvents.map((event) => (
                                        <li key={event.id} className="py-3">
                                            <p className="font-medium text-gray-900">{event.title}</p>
                                            <p className="text-sm text-gray-600">{event.venue || 'No venue'}</p>
                                            <p className="text-xs text-gray-500">{new Date(event.start_date).toLocaleDateString()}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm">No upcoming events.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
