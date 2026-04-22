import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ subject, flash }) {
    const { data, setData, put, processing, errors } = useForm({
        name: subject.name,
        code: subject.code,
        credits: subject.credits || '',
        description: subject.description || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.subjects.update', subject.id));
    };

    return (
        <AuthenticatedLayout header="Edit Subject">
            <Head title="Edit Subject" />
            <div className="py-6">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {flash?.success && <FlashMessage message={flash.success} />}

                            <Input
                                label="Subject Name"
                                name="name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                error={errors.name}
                                required
                            />
                            <Input
                                label="Subject Code"
                                name="code"
                                value={data.code}
                                onChange={e => setData('code', e.target.value)}
                                error={errors.code}
                                required
                            />
                            <Input
                                label="Credits"
                                name="credits"
                                type="number"
                                value={data.credits}
                                onChange={e => setData('credits', e.target.value)}
                                error={errors.credits}
                                min={1}
                                max={6}
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

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="secondary" onClick={() => window.history.back()} type="button">Cancel</Button>
                                <Button variant="primary" type="submit" disabled={processing}>Update Subject</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
