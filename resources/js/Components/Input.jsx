export default function Input({ label, name, value, onChange, error, type = 'text', required = false, ...props }) {
    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 ${error ? 'border-red-500' : ''}`}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
