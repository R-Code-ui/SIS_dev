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
        date: '',
        start_time: '',
        end_time: '',
        materials: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('teacher.lessons.store'));
    };

    return (
        <TeacherLayout header="Create Lesson">
            <Head title="Create Lesson" />
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Materials / Resources</label>
                                <textarea
                                    rows={3}
                                    value={data.materials}
                                    onChange={e => setData('materials', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    placeholder="Links, file names, or notes"
                                />
                                {errors.materials && <p className="text-red-500 text-sm">{errors.materials}</p>}
                            </div>
                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="secondary" onClick={() => window.history.back()} type="button">Cancel</Button>
                                <Button variant="primary" type="submit" disabled={processing}>Create Lesson</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
