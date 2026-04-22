import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-[#f8fafc] pt-6 sm:justify-center sm:pt-0">
            {/* Brand Header */}
            <div className="mb-8 flex flex-col items-center gap-3">
                <Link href="/">
                    <ApplicationLogo className="h-24 w-auto drop-shadow-sm transition-transform hover:scale-105" />
                </Link>
                <div className="text-center">
                    <h2 className="text-xl font-black uppercase tracking-tighter text-[#346739]">
                        Oakhaven Academy
                    </h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
                        Student Information System
                    </p>
                </div>
            </div>

            {/* Form Card */}
            <div className="w-full overflow-hidden bg-white px-8 py-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:max-w-md sm:rounded-2xl border border-gray-100">
                {children}
            </div>

            {/* Subtle Footer */}
            <div className="mt-8 text-center">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                    Knowledge • Growth • Innovation
                </p>
            </div>
        </div>
    );
}
