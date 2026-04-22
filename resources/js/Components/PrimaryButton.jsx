export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-xl border border-transparent bg-[#346739] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition duration-200 ease-in-out hover:bg-[#2a522e] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#346739] focus:ring-offset-2 active:bg-[#1e3d22] ${
                    disabled && 'opacity-50 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
