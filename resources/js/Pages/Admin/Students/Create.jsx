import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Input from '@/Components/Input';
import Select from '@/Components/Select';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Create({ classes, flash }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        admission_no: '',
        roll_number: '',
        class_id: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.students.store'));
    };

    return (
        <AuthenticatedLayout header="Create Student">
            <Head title="Create Student" />
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
                                label="Admission No"
                                name="admission_no"
                                value={data.admission_no}
                                onChange={e => setData('admission_no', e.target.value)}
                                error={errors.admission_no}
                                required
                            />
                            <Input
                                label="Roll Number"
                                name="roll_number"
                                value={data.roll_number}
                                onChange={e => setData('roll_number', e.target.value)}
                                error={errors.roll_number}
                            />
                            <Select
                                label="Class"
                                name="class_id"
                                value={data.class_id}
                                onChange={e => setData('class_id', e.target.value)}
                                options={classes.map(c => ({ value: c.id, label: c.name }))}
                                error={errors.class_id}
                            />
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
                                <Button variant="primary" type="submit" disabled={processing}>Create Student</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
