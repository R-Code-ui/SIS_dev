import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Input from '@/Components/Input';
import Select from '@/Components/Select';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ assignment, classes, subjects, teachers, flash }) {
    const { data, setData, put, processing, errors } = useForm({
        title: assignment.title,
        description: assignment.description || '',
        class_id: assignment.class_id,
        subject_id: assignment.subject_id,
        teacher_id: assignment.teacher_id,
        due_date: assignment.due_date,
        file_path: assignment.file_path || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.assignments.update', assignment.id));
    };

    return (
        <AuthenticatedLayout header="Edit Assignment">
            <Head title="Edit Assignment" />
            <div className="py-6">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {flash?.success && <FlashMessage message={flash.success} />}

                            <Input
                                label="Assignment Title"
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
                                    rows={3}
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                            </div>

                            <Select
                                label="Class"
                                name="class_id"
                                value={data.class_id}
                                onChange={e => setData('class_id', e.target.value)}
                                options={classes.map(c => ({ value: c.id, label: c.name }))}
                                error={errors.class_id}
                                required
                            />
                            <Select
                                label="Subject"
                                name="subject_id"
                                value={data.subject_id}
                                onChange={e => setData('subject_id', e.target.value)}
                                options={subjects.map(s => ({ value: s.id, label: `${s.name} (${s.code})` }))}
                                error={errors.subject_id}
                                required
                            />
                            <Select
                                label="Teacher"
                                name="teacher_id"
                                value={data.teacher_id}
                                onChange={e => setData('teacher_id', e.target.value)}
                                options={teachers.map(t => ({ value: t.id, label: t.user?.name || 'Unknown' }))}
                                error={errors.teacher_id}
                                required
                            />

                            <Input
                                label="Due Date"
                                name="due_date"
                                type="date"
                                value={data.due_date}
                                onChange={e => setData('due_date', e.target.value)}
                                error={errors.due_date}
                                required
                            />

                            <Input
                                label="File Path (Optional)"
                                name="file_path"
                                value={data.file_path}
                                onChange={e => setData('file_path', e.target.value)}
                                error={errors.file_path}
                                placeholder="e.g., /uploads/assignment.pdf"
                            />

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="secondary" onClick={() => window.history.back()} type="button">Cancel</Button>
                                <Button variant="primary" type="submit" disabled={processing}>Update Assignment</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
