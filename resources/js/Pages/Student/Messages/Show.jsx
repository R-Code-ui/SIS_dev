import StudentLayout from '@/Layouts/StudentLayout';
import Button from '@/Components/Button';
import { Head, router } from '@inertiajs/react';

export default function Show({ message }) {
    return (
        <StudentLayout header="Message Details">
            <Head title="Message" />
            <div className="py-6">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-xl font-bold text-gray-900">{message.subject}</h1>
                            <Button variant="secondary" onClick={() => window.history.back()}>Back</Button>
                        </div>
                        <div className="border-t border-gray-200 pt-4 mb-4">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div><span className="font-medium">From:</span> {message.sender?.name}</div>
                                <div><span className="font-medium">To:</span> {message.receiver?.name}</div>
                                <div><span className="font-medium">Sent:</span> {new Date(message.created_at).toLocaleString()}</div>
                                <div><span className="font-medium">Status:</span> {message.is_read ? 'Read' : 'Unread'}</div>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded p-4 whitespace-pre-wrap">
                            {message.body}
                        </div>
                        {message.sender_id !== message.receiver_id && (
                            <div className="mt-4 flex justify-end">
                                <Button variant="primary" onClick={() => router.visit(route('student.messages.create'), {
                                    data: { receiver_id: message.sender_id, subject: `Re: ${message.subject}` }
                                })}>Reply</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
