import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ roles, classes, flash }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        expiry_date: '',
        target_type: 'all',
        target_roles: [],
        target_class_ids: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.announcements.store'));
    };

    return (
        <AuthenticatedLayout header="Create Announcement">
            <Head title="Create Announcement" />
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

                            {/* Targeting fields */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                                <select
                                    value={data.target_type}
                                    onChange={e => setData('target_type', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                >
                                    <option value="all">Everyone</option>
                                    <option value="role">Specific Roles</option>
                                    <option value="class">Specific Classes</option>
                                </select>
                            </div>

                            {data.target_type === 'role' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Roles</label>
                                    <select
                                        multiple
                                        value={data.target_roles}
                                        onChange={e => setData('target_roles', Array.from(e.target.selectedOptions, o => o.value))}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    >
                                        {roles.map(role => <option key={role} value={role}>{role}</option>)}
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">Hold Ctrl (Cmd) to select multiple</p>
                                </div>
                            )}

                            {data.target_type === 'class' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Classes</label>
                                    <select
                                        multiple
                                        value={data.target_class_ids}
                                        onChange={e => setData('target_class_ids', Array.from(e.target.selectedOptions, o => o.value))}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    >
                                        {classes.map(cls => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">Hold Ctrl (Cmd) to select multiple</p>
                                </div>
                            )}

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="secondary" onClick={() => window.history.back()} type="button">Cancel</Button>
                                <Button variant="primary" type="submit" disabled={processing}>Publish Announcement</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
