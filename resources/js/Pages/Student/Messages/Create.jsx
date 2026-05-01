import StudentLayout from '@/Layouts/StudentLayout';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ recipients, flash }) {
    const { data, setData, post, processing, errors } = useForm({
        receiver_id: '',
        subject: '',
        body: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('student.messages.store'));
    };

    return (
        <StudentLayout header="New Message">
            <Head title="New Message" />
            <div className="py-6">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {flash?.success && <FlashMessage message={flash.success} type="success" />}
                            {flash?.error && <FlashMessage message={flash.error} type="error" />}

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                                <select
                                    name="receiver_id"
                                    value={data.receiver_id}
                                    onChange={e => setData('receiver_id', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    required
                                >
                                    <option value="">Select recipient</option>
                                    {recipients?.map(r => (
                                        <option key={r.id} value={r.id}>{r.name} ({r.role})</option>
                                    ))}
                                </select>
                                {errors.receiver_id && <p className="text-red-500 text-sm">{errors.receiver_id}</p>}
                            </div>
                            <Input
                                label="Subject"
                                name="subject"
                                value={data.subject}
                                onChange={e => setData('subject', e.target.value)}
                                error={errors.subject}
                                required
                            />
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    rows={6}
                                    value={data.body}
                                    onChange={e => setData('body', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    required
                                />
                                {errors.body && <p className="text-red-500 text-sm">{errors.body}</p>}
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button variant="secondary" onClick={() => window.history.back()} type="button">Cancel</Button>
                                <Button variant="primary" type="submit" disabled={processing}>Send Message</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
