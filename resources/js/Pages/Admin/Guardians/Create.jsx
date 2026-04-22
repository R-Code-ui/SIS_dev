import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Create({ students, flash }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        occupation: '',
        password: '',
        password_confirmation: '',
        student_ids: [], // array of student IDs
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.guardians.store'));
    };

    // Handle multi-select change
    const handleStudentSelect = (e) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        setData('student_ids', selected);
    };

    return (
        <AuthenticatedLayout header="Create Guardian">
            <Head title="Create Guardian" />
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

                            <div className="relative">
                                <Input
                                    label="Password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    error={errors.password}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 top-6 pr-3 text-sm text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            <Input
                                label="Confirm Password"
                                name="password_confirmation"
                                type={showPassword ? 'text' : 'password'}
                                value={data.password_confirmation}
                                onChange={e => setData('password_confirmation', e.target.value)}
                                error={errors.password_confirmation}
                                required
                            />

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="secondary" onClick={() => window.history.back()} type="button">Cancel</Button>
                                <Button variant="primary" type="submit" disabled={processing}>Create Guardian</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
