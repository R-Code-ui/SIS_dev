import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Input from '@/Components/Input';
import Select from '@/Components/Select';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ lesson, classes, subjects, teachers, flash }) {
    const { data, setData, put, processing, errors } = useForm({
        title: lesson.title,
        description: lesson.description || '',
        class_id: lesson.class_id,
        subject_id: lesson.subject_id,
        teacher_id: lesson.teacher_id,
        date: lesson.date,
        start_time: lesson.start_time || '',
        end_time: lesson.end_time || '',
        materials: lesson.materials || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.lessons.update', lesson.id));
    };

    return (
        <AuthenticatedLayout header="Edit Lesson">
            <Head title="Edit Lesson" />
            <div className="py-6">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {flash?.success && <FlashMessage message={flash.success} />}

                            <Input
                                label="Lesson Title"
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
                                label="Date"
                                name="date"
                                type="date"
                                value={data.date}
                                onChange={e => setData('date', e.target.value)}
                                error={errors.date}
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Start Time"
                                    name="start_time"
                                    type="time"
                                    value={data.start_time}
                                    onChange={e => setData('start_time', e.target.value)}
                                    error={errors.start_time}
                                />
                                <Input
                                    label="End Time"
                                    name="end_time"
                                    type="time"
                                    value={data.end_time}
                                    onChange={e => setData('end_time', e.target.value)}
                                    error={errors.end_time}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="materials" className="block text-sm font-medium text-gray-700 mb-1">
                                    Materials / Resources
                                </label>
                                <textarea
                                    id="materials"
                                    rows={3}
                                    value={data.materials}
                                    onChange={e => setData('materials', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    placeholder="Links, file names, or notes"
                                />
                                {errors.materials && <p className="mt-1 text-sm text-red-600">{errors.materials}</p>}
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="secondary" onClick={() => window.history.back()} type="button">Cancel</Button>
                                <Button variant="primary" type="submit" disabled={processing}>Update Lesson</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
