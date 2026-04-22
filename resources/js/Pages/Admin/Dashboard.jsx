import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function AdminDashboard({ stats, recentResults, upcomingEvents, recentAnnouncements }) {
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
        <AuthenticatedLayout header="Admin Dashboard">
            <Head title="Dashboard" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        <StatCard title="Students" value={stats.students} icon="👨‍🎓" color="bg-blue-100 text-blue-600" />
                        <StatCard title="Teachers" value={stats.teachers} icon="👩‍🏫" color="bg-green-100 text-green-600" />
                        <StatCard title="Classes" value={stats.classes} icon="📚" color="bg-yellow-100 text-yellow-600" />
                        <StatCard title="Subjects" value={stats.subjects} icon="📖" color="bg-indigo-100 text-indigo-600" />
                        <StatCard title="Exams" value={stats.exams} icon="📝" color="bg-purple-100 text-purple-600" />
                        <StatCard title="Assignments" value={stats.assignments} icon="📄" color="bg-pink-100 text-pink-600" />
                        <StatCard title="Events" value={stats.events} icon="🎉" color="bg-orange-100 text-orange-600" />
                        <StatCard title="Attendance Rate" value={`${stats.attendanceRate}%`} icon="📊" color="bg-red-100 text-red-600" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Results</h3>
                            <table className="min-w-full">
                                <thead><tr><th className="text-left">Student</th><th className="text-left">Exam</th><th className="text-left">Subject</th><th>Marks</th></tr></thead>
                                <tbody>
                                    {recentResults.map((r, i) => (
                                        <tr key={i}><td>{r.student_name}</td><td>{r.exam_title}</td><td>{r.subject_name}</td><td>{r.marks}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Events</h3>
                            <ul>{upcomingEvents.map((e, i) => (<li key={i}><strong>{e.title}</strong><br/>{new Date(e.start_date).toLocaleDateString()} • {e.venue || 'No venue'}</li>))}</ul>
                        </div>
                    </div>
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Announcements</h3>
                        {recentAnnouncements.map((a, i) => (<div key={i}><h4>{a.title}</h4><p>{a.content.substring(0,150)}…</p><small>By {a.publisher?.name} on {new Date(a.created_at).toLocaleDateString()}</small></div>))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
