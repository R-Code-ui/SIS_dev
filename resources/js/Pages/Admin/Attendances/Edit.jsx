import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Input from '@/Components/Input';
import Select from '@/Components/Select';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ attendance, students, classes, flash }) {
    const { data, setData, put, processing, errors } = useForm({
        student_id: attendance.student_id,
        class_id: attendance.class_id,
        date: attendance.date,
        status: attendance.status,
        remarks: attendance.remarks || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.attendances.update', attendance.id));
    };

    const statusOptions = [
        { value: 'present', label: 'Present' },
        { value: 'absent', label: 'Absent' },
        { value: 'late', label: 'Late' },
        { value: 'excused', label: 'Excused' },
    ];

    return (
        <AuthenticatedLayout header="Edit Attendance Record">
            <Head title="Edit Attendance" />
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
                                options={students.map(s => ({ value: s.id, label: s.user?.name || 'Unknown' }))}
                                error={errors.student_id}
                                required
                            />
                            <Select
                                label="Class"
                                name="class_id"
                                value={data.class_id}
                                onChange={e => setData('class_id', e.target.value)}
                                options={classes.map(c => ({ value: c.id, label: c.name }))}
                                error={errors.class_id}
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
                            <Select
                                label="Status"
                                name="status"
                                value={data.status}
                                onChange={e => setData('status', e.target.value)}
                                options={statusOptions}
                                error={errors.status}
                                required
                            />
                            <div className="mb-4">
                                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
                                    Remarks (optional)
                                </label>
                                <textarea
                                    id="remarks"
                                    rows={2}
                                    value={data.remarks}
                                    onChange={e => setData('remarks', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                />
                                {errors.remarks && <p className="mt-1 text-sm text-red-600">{errors.remarks}</p>}
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="secondary" onClick={() => window.history.back()} type="button">Cancel</Button>
                                <Button variant="primary" type="submit" disabled={processing}>Update Record</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
