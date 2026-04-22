import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                // Base Styles: Removed border-b-2, added rounded-md for a professional look
                'inline-flex items-center px-3 py-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none rounded-md ' +
                (active
                    // Active State: White text with a subtle transparent white background (glass effect)
                    ? 'bg-white/10 text-white shadow-sm'
                    // Inactive State: Light green-tinted text that turns white on hover
                    : 'border-transparent text-green-100 hover:bg-white/5 hover:text-white') +
                ' ' + className
            }
        >
            {children}
        </Link>
    );
}
