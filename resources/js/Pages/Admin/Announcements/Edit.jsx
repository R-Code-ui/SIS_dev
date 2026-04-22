import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ announcement, flash }) {
    const { data, setData, put, processing, errors } = useForm({
        title: announcement.title,
        content: announcement.content,
        expiry_date: announcement.expiry_date || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.announcements.update', announcement.id));
    };

    return (
        <AuthenticatedLayout header="Edit Announcement">
            <Head title="Edit Announcement" />
            <div className="py-6">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {flash?.success && <FlashMessage message={flash.success} />}

                            <Input
                                label="Title"
                                name="title"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                error={errors.title}
                                required
                            />
                            <div className="mb-4">
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                                    Content
                                </label>
                                <textarea
                                    id="content"
                                    rows={6}
                                    value={data.content}
                                    onChange={e => setData('content', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    required
                                />
                                {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
                            </div>
                            <Input
                                label="Expiry Date (optional)"
                                name="expiry_date"
                                type="date"
                                value={data.expiry_date}
                                onChange={e => setData('expiry_date', e.target.value)}
                                error={errors.expiry_date}
                            />

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="secondary" onClick={() => window.history.back()} type="button">Cancel</Button>
                                <Button variant="primary" type="submit" disabled={processing}>Update Announcement</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
