import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ flash }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        venue: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.events.store'));
    };

    return (
        <AuthenticatedLayout header="Create Event">
            <Head title="Create Event" />
            <div className="py-6">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {flash?.success && <FlashMessage message={flash.success} />}

                            <Input
                                label="Event Title"
                                name="title"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                error={errors.title}
                                required
                            />
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    rows={4}
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                            </div>
                            <Input
                                label="Start Date & Time"
                                name="start_date"
                                type="datetime-local"
                                value={data.start_date}
                                onChange={e => setData('start_date', e.target.value)}
                                error={errors.start_date}
                                required
                            />
                            <Input
                                label="End Date & Time"
                                name="end_date"
                                type="datetime-local"
                                value={data.end_date}
                                onChange={e => setData('end_date', e.target.value)}
                                error={errors.end_date}
                                required
                            />
                            <Input
                                label="Venue"
                                name="venue"
                                value={data.venue}
                                onChange={e => setData('venue', e.target.value)}
                                error={errors.venue}
                            />

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="secondary" onClick={() => window.history.back()} type="button">Cancel</Button>
                                <Button variant="primary" type="submit" disabled={processing}>Create Event</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
