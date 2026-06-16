import TeacherLayout from '@/Layouts/TeacherLayout';
import Input from '@/Components/Input';
import Select from '@/Components/Select';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ exams, students, subjects, flash }) {
    const { data, setData, post, processing, errors } = useForm({
        student_id: '',
        exam_id: '',
        subject_id: '',
        marks_obtained: '',
        grade: '',
        remarks: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('teacher.results.store'));
    };

    return (
        <TeacherLayout header="Add Result">
            <Head title="Add Result" />
            <div className="py-6">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {flash?.success && <FlashMessage message={flash.success} />}

                            <Select
                                label="Student"
                                name="student_id"
                                value={data.student_id}
                                onChange={e => setData('student_id', e.target.value)}
                                options={students.map(s => ({ value: s.id, label: s.user?.name }))}
                                error={errors.student_id}
                                required
                            />
                            <Select
                                label="Exam"
                                name="exam_id"
                                value={data.exam_id}
                                onChange={e => setData('exam_id', e.target.value)}
                                options={exams.map(e => ({ value: e.id, label: e.title }))}
                                error={errors.exam_id}
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
                                label="Marks Obtained"
                                name="marks_obtained"
                                type="number"
                                value={data.marks_obtained}
                                onChange={e => setData('marks_obtained', e.target.value)}
                                error={errors.marks_obtained}
                                required
                                min={0}
                            />
                            <Input
                                label="Grade (optional)"
                                name="grade"
                                value={data.grade}
                                onChange={e => setData('grade', e.target.value)}
                                error={errors.grade}
                            />
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                                <textarea
                                    rows={3}
                                    value={data.remarks}
                                    onChange={e => setData('remarks', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                />
                                {errors.remarks && <p className="text-red-500 text-sm">{errors.remarks}</p>}
                            </div>
                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="secondary" onClick={() => window.history.back()} type="button">Cancel</Button>
                                <Button variant="primary" type="submit" disabled={processing}>Save Result</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
