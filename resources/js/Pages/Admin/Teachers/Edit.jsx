import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ teacher, flash }) {
    const { data, setData, put, processing, errors } = useForm({
        name: teacher.user.name,
        email: teacher.user.email,
        employee_id: teacher.employee_id,
        department: teacher.department || '',
        phone: teacher.phone || '',
        address: teacher.address || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.teachers.update', teacher.id));
    };

    return (
        <AuthenticatedLayout header="Edit Teacher">
            <Head title="Edit Teacher" />
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
                                label="Employee ID"
                                name="employee_id"
                                value={data.employee_id}
                                onChange={e => setData('employee_id', e.target.value)}
                                error={errors.employee_id}
                                required
                            />
                            <Input
                                label="Department"
                                name="department"
                                value={data.department}
                                onChange={e => setData('department', e.target.value)}
                                error={errors.department}
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

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="secondary" onClick={() => window.history.back()} type="button">Cancel</Button>
                                <Button variant="primary" type="submit" disabled={processing}>Update Teacher</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
