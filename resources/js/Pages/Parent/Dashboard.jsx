import ParentLayout from '@/Layouts/ParentLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ children, latestAnnouncements, upcomingEvents }) {
    // Safe fallbacks
    const childrenList = Array.isArray(children) ? children : [];
    const announcementsList = Array.isArray(latestAnnouncements) ? latestAnnouncements : [];
    const eventsList = Array.isArray(upcomingEvents) ? upcomingEvents : [];

    const StatCard = ({ title, value, icon, color }) => (
        <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
            <div className={`p-2 rounded-full ${color}`}>{icon}</div>
        </div>
    );

    return (
        <ParentLayout header="Parent Dashboard">
            <Head title="Dashboard" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-6">Welcome to Your Dashboard</h1>

                    {/* Children Cards */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Children</h2>
                        {childrenList.length === 0 ? (
                            <p className="text-gray-500">No children linked to your account.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {childrenList.map((child) => (
                                    <div key={child.id} className="bg-white shadow rounded-lg overflow-hidden">
                                        <div className="bg-green-700 px-4 py-3">
                                            <h3 className="text-lg font-semibold text-white">{child.name}</h3>
                                            <p className="text-green-100 text-sm">{child.class_name}</p>
                                        </div>
                                        <div className="p-4 space-y-3">
                                            <StatCard title="Attendance Rate" value={`${child.attendance_rate}%`} icon="📊" color="bg-blue-100 text-blue-600" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Upcoming Exams</p>
                                                {child.upcoming_exams?.length > 0 ? (
                                                    <ul className="mt-1 text-sm text-gray-600">
                                                        {child.upcoming_exams.map(exam => (
                                                            <li key={exam.id}>{exam.title} - {exam.date}</li>
                                                        ))}
                                                    </ul>
                                                ) : <p className="text-sm text-gray-500">None</p>}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Pending Assignments</p>
                                                {child.pending_assignments?.length > 0 ? (
                                                    <ul className="mt-1 text-sm text-gray-600">
                                                        {child.pending_assignments.map(assign => (
                                                            <li key={assign.id}>{assign.title} - Due: {assign.due_date}</li>
                                                        ))}
                                                    </ul>
                                                ) : <p className="text-sm text-gray-500">None</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Announcements & Events (two columns) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Announcements</h3>
                            {announcementsList.length > 0 ? (
                                <ul className="divide-y divide-gray-200">
                                    {announcementsList.map((ann) => (
                                        <li key={ann.id} className="py-3">
                                            <p className="font-medium text-gray-900">{ann.title}</p>
                                            <p className="text-sm text-gray-600">{ann.content.substring(0, 100)}...</p>
                                            <p className="text-xs text-gray-400">{new Date(ann.created_at).toLocaleDateString()}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-gray-500">No announcements.</p>}
                        </div>
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
                            {eventsList.length > 0 ? (
                                <ul className="divide-y divide-gray-200">
                                    {eventsList.map((event) => (
                                        <li key={event.id} className="py-3">
                                            <p className="font-medium text-gray-900">{event.title}</p>
                                            <p className="text-sm text-gray-600">{event.venue || 'No venue'}</p>
                                            <p className="text-xs text-gray-500">{new Date(event.start_date).toLocaleDateString()}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-gray-500">No upcoming events.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </ParentLayout>
    );
}
