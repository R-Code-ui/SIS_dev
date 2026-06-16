import TeacherLayout from '@/Layouts/TeacherLayout';
import Input from '@/Components/Input';
import Select from '@/Components/Select';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ classes, subjects, flash }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        class_id: '',
        subject_id: '',
        due_date: '',
        file: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('teacher.assignments.store'));
    };

    return (
        <TeacherLayout header="Create Assignment">
            <Head title="Create Assignment" />
            <div className="py-6">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <form onSubmit={handleSubmit} encType="multipart/form-data" className="p-6 space-y-4">
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows={4}
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                />
                                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
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
                                options={subjects.map(s => ({ value: s.id, label: s.name }))}
                                error={errors.subject_id}
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
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Attachment (optional, max 10MB)</label>
                                <input
                                    type="file"
                                    onChange={(e) => setData('file', e.target.files[0])}
                                    className="w-full"
                                />
                                {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
                            </div>
                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="secondary" onClick={() => window.history.back()} type="button">Cancel</Button>
                                <Button variant="primary" type="submit" disabled={processing}>Create Assignment</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
