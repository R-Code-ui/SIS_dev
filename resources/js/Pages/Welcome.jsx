import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Oakhaven Academy - Student Information System" />

            <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-[#346739] selection:text-white">

                {/* --- NAVIGATION --- */}
                <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-white/70 backdrop-blur-lg">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        {/* Logo & School Name */}
                        <div className="flex items-center gap-4">
                            {/* Increased height to h-16 for a medium look */}
                            <img src="/images/logo.png" alt="Oakhaven Academy Logo" className="h-16 w-auto" />
                            <div className="flex flex-col">
                                <span className="text-2xl font-black tracking-tighter text-[#346739] uppercase">
                                    Oakhaven Academy
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                                    Knowledge • Growth • Innovation
                                </span>
                            </div>
                        </div>

                        {/* Auth Links */}
                        <div className="flex items-center gap-6">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-full bg-[#346739] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#2a522e] hover:shadow-lg"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="text-sm font-medium text-gray-600 transition hover:text-[#346739]">
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-full border-2 border-[#346739] px-6 py-2 text-sm font-bold text-[#346739] transition hover:bg-[#346739] hover:text-white"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* --- HERO SECTION --- */}
                <section className="relative h-[90vh] w-full">
                    {/* Background Image Container */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/images/wallpaper.jpg"
                            alt="Oakhaven Campus"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/75"></div>
                    </div>

                    {/* Hero Content */}
                    <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6">
                        <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-1000">
                            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
                                <span className="text-green-400">Oakhaven</span> <br />
                                Information System
                            </h1>
                            <p className="text-lg text-gray-300 sm:text-xl leading-relaxed">
                                Cultivating a legacy of academic excellence through <span className="text-white font-semibold">Knowledge</span>,
                                fostering personal <span className="text-white font-semibold">Growth</span>, and driving digital <span className="text-white font-semibold">Innovation</span>.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link
                                    href={auth.user ? route('dashboard') : route('login')}
                                    className="rounded-lg bg-[#346739] px-8 py-4 text-lg font-bold text-white shadow-xl transition hover:scale-105 hover:bg-[#2d5a32]"
                                >
                                    Get Started
                                </Link>
                                <button className="rounded-lg bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition hover:bg-white/20">
                                    System Overview
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- QUICK STATS / FEATURES --- */}
                <section className="bg-gray-50 py-20">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="grid gap-12 sm:grid-cols-3">
                            <div className="space-y-3">
                                <div className="text-xs font-bold uppercase tracking-widest text-green-600">Knowledge</div>
                                <div className="text-3xl font-bold text-gray-900">Academic Mastery</div>
                                <p className="text-gray-600">Access comprehensive curriculum tools and real-time grade tracking.</p>
                            </div>
                            <div className="space-y-3">
                                <div className="text-xs font-bold uppercase tracking-widest text-green-600">Growth</div>
                                <div className="text-3xl font-bold text-gray-900">Student Progress</div>
                                <p className="text-gray-600">Dedicated portals to monitor and nurture individual student development.</p>
                            </div>
                            <div className="space-y-3">
                                <div className="text-xs font-bold uppercase tracking-widest text-green-600">Innovation</div>
                                <div className="text-3xl font-bold text-gray-900">Future-Ready</div>
                                <p className="text-gray-600">Streamlined cloud infrastructure for a 21st-century learning environment.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- FOOTER --- */}
                <footer className="bg-[#1a2e1c] py-16 text-white">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="grid gap-12 lg:grid-cols-4">
                            {/* Brand Column */}
                            <div className="lg:col-span-2">
                                <div className="flex items-center gap-3">
                                    <img src="/images/logo.png" alt="Footer Logo" className="h-10 w-auto brightness-200" />
                                    <span className="text-xl font-bold uppercase tracking-widest">Oakhaven Academy</span>
                                </div>
                                <p className="mt-6 max-w-sm text-sm leading-relaxed text-green-100/60">
                                    Official Student Information System of Oakhaven Academy.
                                    Empowering the next generation through digital transformation.
                                </p>
                            </div>

                            {/* Links */}
                            <div>
                                <h4 className="mb-6 font-bold text-green-400 uppercase text-xs tracking-widest">Academy</h4>
                                <ul className="space-y-4 text-sm text-green-100/60">
                                    <li><Link href="#" className="hover:text-white">Announcements</Link></li>
                                    <li><Link href="#" className="hover:text-white">Events</Link></li>
                                    <li><Link href="#" className="hover:text-white">Portal Help</Link></li>
                                </ul>
                            </div>

                            {/* Legal */}
                            <div>
                                <h4 className="mb-6 font-bold text-green-400 uppercase text-xs tracking-widest">Account</h4>
                                <ul className="space-y-4 text-sm text-green-100/60">
                                    <li><Link href={route('login')} className="hover:text-white">Staff Login</Link></li>
                                    <li><Link href={route('register')} className="hover:text-white">Student Registration</Link></li>
                                    <li><Link href="#" className="hover:text-white">Security Policy</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-16 border-t border-white/10 pt-8 text-center text-xs text-green-100/40">
                            © 2026 Oakhaven Academy. Knowledge • Growth • Innovation
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
