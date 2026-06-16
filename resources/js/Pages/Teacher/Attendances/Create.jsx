import TeacherLayout from '@/Layouts/TeacherLayout';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Create({ classes, students, selectedClass }) {
    const [selectedClassId, setSelectedClassId] = useState(selectedClass || '');
    const [selectedDate, setSelectedDate] = useState('');
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadStudents = () => {
        if (!selectedClassId || !selectedDate) {
            alert('Please select a class and date first');
            return;
        }
        setLoading(true);
        router.get(route('teacher.attendances.create'), {
            class_id: selectedClassId,
            date: selectedDate,
        }, {
            preserveState: false,
            onSuccess: (page) => {
                setAttendanceData(page.props.students.map(s => ({
                    student_id: s.id,
                    status: 'present',
                    remarks: '',
                })));
                setLoading(false);
            },
            onError: () => setLoading(false),
        });
    };

    const { post, processing, errors } = useForm({
        class_id: selectedClassId,
        date: selectedDate,
        attendances: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('teacher.attendances.store'), {
            data: {
                class_id: selectedClassId,
                date: selectedDate,
                attendances: attendanceData,
            },
        });
    };

    return (
        <TeacherLayout header="Mark Attendance">
            <Head title="Mark Attendance" />
            <div className="py-6">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                                    <select
                                        value={selectedClassId}
                                        onChange={(e) => setSelectedClassId(e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        required
                                    >
                                        <option value="">Select Class</option>
                                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="button" variant="secondary" onClick={loadStudents} disabled={!selectedClassId || !selectedDate}>
                                Load Students
                            </Button>

                            {loading && <div>Loading students...</div>}

                            {attendanceData.length > 0 && (
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
                                                    const att = attendanceData.find(a => a.student_id === student.id) || { status: 'present', remarks: '' };
                                                    return (
                                                        <tr key={student.id} className="border-t">
                                                            <td className="px-4 py-2">{student.user?.name}</td>
                                                            <td className="px-4 py-2">
                                                                <select
                                                                    value={att.status}
                                                                    onChange={(e) => {
                                                                        const newData = [...attendanceData];
                                                                        const index = newData.findIndex(a => a.student_id === student.id);
                                                                        if (index >= 0) newData[index].status = e.target.value;
                                                                        else newData.push({ student_id: student.id, status: e.target.value, remarks: '' });
                                                                        setAttendanceData(newData);
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
                                                                    value={att.remarks}
                                                                    onChange={(e) => {
                                                                        const newData = [...attendanceData];
                                                                        const index = newData.findIndex(a => a.student_id === student.id);
                                                                        if (index >= 0) newData[index].remarks = e.target.value;
                                                                        else newData.push({ student_id: student.id, status: 'present', remarks: e.target.value });
                                                                        setAttendanceData(newData);
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
                            )}

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="secondary" onClick={() => window.history.back()} type="button">Cancel</Button>
                                <Button variant="primary" type="submit" disabled={processing || attendanceData.length === 0}>
                                    Save Attendance
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
