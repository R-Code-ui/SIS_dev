import StudentLayout from '@/Layouts/StudentLayout';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import FlashMessage from '@/Components/FlashMessage';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ assignment, submission, flash }) {
    const { data, setData, post, processing, errors } = useForm({
        submission_text: submission?.submission_text || '',
        file: null,
    });

    const [showFile, setShowFile] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('student.assignments.store', assignment.id));
    };

    return (
        <StudentLayout header={assignment.title}>
            <Head title={assignment.title} />
            <div className="py-6">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{assignment.title}</h1>
                        <p className="text-sm text-gray-600 mb-4">
                            <strong>Subject:</strong> {assignment.subject?.name} &nbsp;|&nbsp;
                            <strong>Due Date:</strong> {new Date(assignment.due_date).toLocaleDateString()} &nbsp;|&nbsp;
                            <strong>Teacher:</strong> {assignment.teacher?.user?.name}
                        </p>
                        {assignment.description && (
                            <div className="mt-4 p-4 bg-gray-50 rounded">
                                <p className="text-gray-700 whitespace-pre-wrap">{assignment.description}</p>
                            </div>
                        )}
                        {assignment.file_path && (
                            <div className="mt-4">
                                <a href={assignment.file_path} target="_blank" className="text-green-600 hover:underline">📎 Download Assignment File</a>
                            </div>
                        )}
                    </div>

                    {flash?.success && <FlashMessage message={flash.success} type="success" />}
                    {flash?.error && <FlashMessage message={flash.error} type="error" />}

                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Submission</h2>
                        {submission && (
                            <div className="mb-4 p-3 bg-green-50 rounded">
                                <p><strong>Submitted on:</strong> {new Date(submission.submitted_at).toLocaleString()}</p>
                                {submission.score !== null && <p><strong>Score:</strong> {submission.score}</p>}
                                {submission.feedback && <p><strong>Feedback:</strong> {submission.feedback}</p>}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Text Submission (optional)</label>
                                <textarea rows={5} value={data.submission_text} onChange={e => setData('submission_text', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                                {errors.submission_text && <p className="text-red-500 text-sm">{errors.submission_text}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">File Upload (optional, max 10MB)</label>
                                <input type="file" onChange={e => setData('file', e.target.files[0])}
                                    className="w-full" />
                                {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
                            </div>
                            <Button variant="primary" type="submit" disabled={processing}>
                                {submission ? 'Update Submission' : 'Submit Assignment'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
