import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Input from '@/Components/Input';
import Select from '@/Components/Select';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ student, classes, flash }) {
    const { data, setData, put, processing, errors } = useForm({
        name: student.user.name,
        email: student.user.email,
        admission_no: student.admission_no,
        roll_number: student.roll_number || '',
        class_id: student.class_id || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.students.update', student.id));
    };

    return (
        <AuthenticatedLayout header="Edit Student">
            <Head title="Edit Student" />
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

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="secondary" onClick={() => window.history.back()} type="button">Cancel</Button>
                                <Button variant="primary" type="submit" disabled={processing}>Update Student</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
