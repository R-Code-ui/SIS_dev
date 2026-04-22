import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Input from '@/Components/Input';
import Select from '@/Components/Select';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ exam, classes, subjects, flash }) {
    const { data, setData, put, processing, errors } = useForm({
        title: exam.title,
        description: exam.description || '',
        class_id: exam.class_id,
        subject_id: exam.subject_id,
        date: exam.date,
        max_marks: exam.max_marks,
        passing_marks: exam.passing_marks,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.exams.update', exam.id));
    };

    return (
        <AuthenticatedLayout header="Edit Exam">
            <Head title="Edit Exam" />
            <div className="py-6">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {flash?.success && <FlashMessage message={flash.success} />}

                            <Input
                                label="Exam Title"
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

                            <Input
                                label="Exam Date"
                                name="date"
                                type="date"
                                value={data.date}
                                onChange={e => setData('date', e.target.value)}
                                error={errors.date}
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Max Marks"
                                    name="max_marks"
                                    type="number"
                                    value={data.max_marks}
                                    onChange={e => setData('max_marks', e.target.value)}
                                    error={errors.max_marks}
                                    required
                                    min={1}
                                />
                                <Input
                                    label="Passing Marks"
                                    name="passing_marks"
                                    type="number"
                                    value={data.passing_marks}
                                    onChange={e => setData('passing_marks', e.target.value)}
                                    error={errors.passing_marks}
                                    required
                                    min={0}
                                />
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="secondary" onClick={() => window.history.back()} type="button">Cancel</Button>
                                <Button variant="primary" type="submit" disabled={processing}>Update Exam</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
