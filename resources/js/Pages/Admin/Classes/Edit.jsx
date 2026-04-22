import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ class: classItem, teachers, subjects, flash }) {
    const { data, setData, put, processing, errors } = useForm({
        name: classItem.name,
        grade_level: classItem.grade_level,
        academic_year: classItem.academic_year,
        section: classItem.section || '',
        capacity: classItem.capacity || '',
        teacher_ids: classItem.teachers?.map(t => t.id) || [],
        subject_ids: classItem.subjects?.map(s => s.id) || [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.classes.update', classItem.id));
    };

    const handleTeacherSelect = (e) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        setData('teacher_ids', selected);
    };

    const handleSubjectSelect = (e) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        setData('subject_ids', selected);
    };

    return (
        <AuthenticatedLayout header="Edit Class">
            <Head title="Edit Class" />
            <div className="py-6">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {flash?.success && <FlashMessage message={flash.success} />}

                            <Input
                                label="Class Name"
                                name="name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                error={errors.name}
                                required
                            />
                            <Input
                                label="Grade Level"
                                name="grade_level"
                                value={data.grade_level}
                                onChange={e => setData('grade_level', e.target.value)}
                                error={errors.grade_level}
                                required
                            />
                            <Input
                                label="Academic Year"
                                name="academic_year"
                                value={data.academic_year}
                                onChange={e => setData('academic_year', e.target.value)}
                                error={errors.academic_year}
                                required
                            />
                            <Input
                                label="Section"
                                name="section"
                                value={data.section}
                                onChange={e => setData('section', e.target.value)}
                                error={errors.section}
                            />
                            <Input
                                label="Capacity"
                                name="capacity"
                                type="number"
                                value={data.capacity}
                                onChange={e => setData('capacity', e.target.value)}
                                error={errors.capacity}
                                min={1}
                                max={200}
                            />

                            {/* Multi-select for teachers */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Assign Teachers
                                </label>
                                <select
                                    multiple
                                    value={data.teacher_ids}
                                    onChange={handleTeacherSelect}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    size={5}
                                >
                                    {teachers.map(teacher => (
                                        <option key={teacher.id} value={teacher.id}>
                                            {teacher.user.name} ({teacher.employee_id})
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-xs text-gray-500">Hold Ctrl (Cmd) to select multiple</p>
                                {errors.teacher_ids && <p className="mt-1 text-sm text-red-600">{errors.teacher_ids}</p>}
                            </div>

                            {/* Multi-select for subjects */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Assign Subjects
                                </label>
                                <select
                                    multiple
                                    value={data.subject_ids}
                                    onChange={handleSubjectSelect}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    size={5}
                                >
                                    {subjects.map(subject => (
                                        <option key={subject.id} value={subject.id}>
                                            {subject.name} ({subject.code})
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-xs text-gray-500">Hold Ctrl (Cmd) to select multiple</p>
                                {errors.subject_ids && <p className="mt-1 text-sm text-red-600">{errors.subject_ids}</p>}
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="secondary" onClick={() => window.history.back()} type="button">Cancel</Button>
                                <Button variant="primary" type="submit" disabled={processing}>Update Class</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
