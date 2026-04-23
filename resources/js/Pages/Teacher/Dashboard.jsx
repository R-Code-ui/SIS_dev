import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ classes, upcomingExams, pendingAssignments, recentLessons, stats }) {
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
        <TeacherLayout header="Teacher Dashboard">
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        <StatCard title="My Classes" value={stats.totalClasses} icon="📚" color="bg-blue-100 text-blue-600" />
                        <StatCard title="My Students" value={stats.totalStudents} icon="👨‍🎓" color="bg-green-100 text-green-600" />
                        <StatCard title="Upcoming Exams" value={stats.upcomingExams} icon="📝" color="bg-yellow-100 text-yellow-600" />
                        <StatCard title="Pending Assignments" value={stats.pendingAssignments} icon="📄" color="bg-purple-100 text-purple-600" />
                    </div>

                    {/* Two columns: Upcoming Exams & Pending Assignments */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Exams</h3>
                            {upcomingExams.length > 0 ? (
                                <ul className="divide-y divide-gray-200">
                                    {upcomingExams.map((exam, idx) => (
                                        <li key={idx} className="py-3">
                                            <p className="font-medium text-gray-900">{exam.title}</p>
                                            <p className="text-sm text-gray-600">{exam.class?.name} • {exam.subject?.name}</p>
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
                                    {pendingAssignments.map((assignment, idx) => (
                                        <li key={idx} className="py-3">
                                            <p className="font-medium text-gray-900">{assignment.title}</p>
                                            <p className="text-sm text-gray-600">{assignment.class?.name} • {assignment.subject?.name}</p>
                                            <p className="text-xs text-gray-500">Due: {new Date(assignment.due_date).toLocaleDateString()}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm">No pending assignments.</p>
                            )}
                        </div>
                    </div>

                    {/* Recent Lessons */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Lessons</h3>
                        {recentLessons.length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                                {recentLessons.map((lesson, idx) => (
                                    <li key={idx} className="py-3">
                                        <p className="font-medium text-gray-900">{lesson.title}</p>
                                        <p className="text-sm text-gray-600">{lesson.class?.name} • {lesson.subject?.name}</p>
                                        <p className="text-xs text-gray-500">{new Date(lesson.date).toLocaleDateString()}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-sm">No lessons yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
