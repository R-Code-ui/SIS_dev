import Button from './Button';

export default function DataTable({ columns, data, actions, onEdit, onDelete }) {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map(col => (
                            <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {col.label}
                            </th>
                        ))}
                        {actions && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                            {columns.map(col => (
                                <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {col.render ? col.render(item) : item[col.key]}
                                </td>
                            ))}
                            {actions && (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Button variant="secondary" onClick={() => onEdit(item)} className="mr-2">Edit</Button>
                                    <Button variant="danger" onClick={() => onDelete(item)}>Delete</Button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
