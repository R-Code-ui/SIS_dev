import Button from './Button';

export default function DataTable({ columns, data, actions, onEdit, onDelete }) {
    // ✅ HARDEN EVERYTHING
    const safeColumns = Array.isArray(columns) ? columns : [];
    const safeData = Array.isArray(data) ? data : [];

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">

                {/* HEADER */}
                <thead className="bg-gray-50">
                    <tr>
                        {safeColumns.map((col) => (
                            <th
                                key={col.key || Math.random()}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {col.label || '-'}
                            </th>
                        ))}
                        {actions && (
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>

                {/* BODY */}
                <tbody className="bg-white divide-y divide-gray-200">
                    {safeData.length > 0 ? (
                        safeData.map((item, idx) => (
                            <tr key={item?.id ?? idx} className="hover:bg-gray-50">
                                {safeColumns.map((col) => (
                                    <td
                                        key={col.key || idx}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                    >
                                        {col.render
                                            ? col.render(item)
                                            : item?.[col.key] ?? '-'}
                                    </td>
                                ))}

                                {actions && (
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Button
                                            variant="secondary"
                                            onClick={() => onEdit && onEdit(item)}
                                            className="mr-2"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => onDelete && onDelete(item)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        // ✅ EMPTY STATE (VERY IMPORTANT)
                        <tr>
                            <td
                                colSpan={safeColumns.length + (actions ? 1 : 0)}
                                className="px-6 py-4 text-center text-sm text-gray-500"
                            >
                                No data available.
                            </td>
                        </tr>
                    )}
                </tbody>

            </table>
        </div>
    );
}
