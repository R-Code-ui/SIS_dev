import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ guardian, students, flash }) {
    const { data, setData, put, processing, errors } = useForm({
        name: guardian.user.name,
        email: guardian.user.email,
        phone: guardian.phone || '',
        address: guardian.address || '',
        occupation: guardian.occupation || '',
        student_ids: guardian.students?.map(s => s.id) || [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.guardians.update', guardian.id));
    };

    const handleStudentSelect = (e) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        setData('student_ids', selected);
    };

    return (
        <AuthenticatedLayout header="Edit Guardian">
            <Head title="Edit Guardian" />
            <div className="py-6">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {flash?.success && <FlashMessage message={flash.success} />}

                            <Input
                                label="Full Name"
                                name="name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                error={errors.name}
                                required
                            />
                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                error={errors.email}
                                required
                            />
                            <Input
                                label="Phone"
                                name="phone"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                error={errors.phone}
                            />
                            <Input
                                label="Address"
                                name="address"
                                value={data.address}
                                onChange={e => setData('address', e.target.value)}
                                error={errors.address}
                            />
                            <Input
                                label="Occupation"
                                name="occupation"
                                value={data.occupation}
                                onChange={e => setData('occupation', e.target.value)}
                                error={errors.occupation}
                            />

                            {/* Multi-select for students */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Link Students (optional)
                                </label>
                                <select
                                    multiple
                                    value={data.student_ids}
                                    onChange={handleStudentSelect}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    size={5}
                                >
                                    {students.map(student => (
                                        <option key={student.id} value={student.id}>
                                            {student.user.name} ({student.admission_no})
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-xs text-gray-500">Hold Ctrl (Cmd) to select multiple</p>
                                {errors.student_ids && <p className="mt-1 text-sm text-red-600">{errors.student_ids}</p>}
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="secondary" onClick={() => window.history.back()} type="button">Cancel</Button>
                                <Button variant="primary" type="submit" disabled={processing}>Update Guardian</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
