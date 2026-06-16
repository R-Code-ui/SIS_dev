import TeacherLayout from '@/Layouts/TeacherLayout';
import Button from '@/Components/Button';
import { Head } from '@inertiajs/react';

export default function Show({ event }) {
    return (
        <TeacherLayout header={event.title}>
            <Head title={event.title} />
            <div className="py-6">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
                            <Button variant="secondary" onClick={() => window.history.back()}>Back</Button>
                        </div>
                        <div className="border-t border-gray-200 pt-4 mb-4">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div><span className="font-medium">Start Date:</span> {new Date(event.start_date).toLocaleString()}</div>
                                <div><span className="font-medium">End Date:</span> {new Date(event.end_date).toLocaleString()}</div>
                                <div><span className="font-medium">Venue:</span> {event.venue || '—'}</div>
                                <div><span className="font-medium">Created By:</span> {event.creator?.name || '—'}</div>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded p-4 whitespace-pre-wrap">
                            {event.description || 'No description provided.'}
                        </div>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
