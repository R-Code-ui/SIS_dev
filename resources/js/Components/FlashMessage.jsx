import { useEffect, useState } from 'react';

export default function FlashMessage({ message, type = 'success' }) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShow(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    if (!show) return null;

    const bgColor = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700';
    return (
        <div className={`mb-4 rounded border px-4 py-3 ${bgColor}`} role="alert">
            <span className="block sm:inline">{message}</span>
        </div>
    );
}
