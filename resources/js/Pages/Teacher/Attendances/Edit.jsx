import TeacherLayout from '@/Layouts/TeacherLayout';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ attendance, classes, students, records, selectedClass, date }) {
    const initialAttendances = students.map(student => ({
        student_id: student.id,
        status: records[student.id]?.status || 'present',
        remarks: records[student.id]?.remarks || '',
    }));

    const { data, setData, put, processing, errors } = useForm({
        class_id: selectedClass,
        date: date,
        attendances: initialAttendances,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('teacher.attendances.update', attendance.id));
    };

    return (
        <TeacherLayout header="Edit Attendance">
            <Head title="Edit Attendance" />
            <div className="py-6">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                                    <select
                                        value={data.class_id}
                                        onChange={(e) => setData('class_id', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500"
                                        disabled
                                    >
                                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500"
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Mark Attendance</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Student</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((student, idx) => {
                                                const att = data.attendances.find(a => a.student_id === student.id);
                                                return (
                                                    <tr key={student.id} className="border-t">
                                                        <td className="px-4 py-2">{student.user?.name}</td>
                                                        <td className="px-4 py-2">
                                                            <select
                                                                value={att?.status || 'present'}
                                                                onChange={(e) => {
                                                                    const newAtt = [...data.attendances];
                                                                    const index = newAtt.findIndex(a => a.student_id === student.id);
                                                                    if (index >= 0) newAtt[index].status = e.target.value;
                                                                    else newAtt.push({ student_id: student.id, status: e.target.value, remarks: '' });
                                                                    setData('attendances', newAtt);
                                                                }}
                                                                className="rounded-md border-gray-300 shadow-sm focus:border-green-500"
                                                            >
                                                                <option value="present">Present</option>
                                                                <option value="absent">Absent</option>
                                                                <option value="late">Late</option>
                                                                <option value="excused">Excused</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <input
                                                                type="text"
                                                                value={att?.remarks || ''}
                                                                onChange={(e) => {
                                                                    const newAtt = [...data.attendances];
                                                                    const index = newAtt.findIndex(a => a.student_id === student.id);
                                                                    if (index >= 0) newAtt[index].remarks = e.target.value;
                                                                    else newAtt.push({ student_id: student.id, status: 'present', remarks: e.target.value });
                                                                    setData('attendances', newAtt);
                                                                }}
                                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500"
                                                                placeholder="Optional"
                                                            />
                                                         </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="secondary" onClick={() => window.history.back()} type="button">Cancel</Button>
                                <Button variant="primary" type="submit" disabled={processing}>Update Attendance</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
