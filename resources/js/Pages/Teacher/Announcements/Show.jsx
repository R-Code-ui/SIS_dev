import TeacherLayout from '@/Layouts/TeacherLayout';
import Button from '@/Components/Button';
import { Head } from '@inertiajs/react';

export default function Show({ announcement }) {
    return (
        <TeacherLayout header={announcement.title}>
            <Head title={announcement.title} />
            <div className="py-6">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-2xl font-bold text-gray-900">{announcement.title}</h1>
                            <Button variant="secondary" onClick={() => window.history.back()}>Back</Button>
                        </div>
                        <div className="border-t border-gray-200 pt-4 mb-4">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div><span className="font-medium">Published By:</span> {announcement.publisher?.name || '—'}</div>
                                <div><span className="font-medium">Date:</span> {new Date(announcement.created_at).toLocaleDateString()}</div>
                                {announcement.expiry_date && (
                                    <div><span className="font-medium">Expires:</span> {new Date(announcement.expiry_date).toLocaleDateString()}</div>
                                )}
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded p-4 whitespace-pre-wrap">
                            {announcement.content}
                        </div>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
