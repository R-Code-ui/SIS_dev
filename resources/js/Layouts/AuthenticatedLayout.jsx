import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: route('dashboard'), current: route().current('dashboard') },
        { name: 'Teachers', href: route('admin.teachers.index'), current: route().current('admin.teachers.*') },
        { name: 'Students', href: route('admin.students.index'), current: route().current('admin.students.*') },
        { name: 'Guardians', href: route('admin.guardians.index'), current: route().current('admin.guardians.*') },
        { name: 'Subjects', href: route('admin.subjects.index'), current: route().current('admin.subjects.*') },
        { name: 'Classes', href: route('admin.classes.index'), current: route().current('admin.classes.*') },
        { name: 'Lessons', href: route('admin.lessons.index'), current: route().current('admin.lessons.*') },
        { name: 'Exams', href: route('admin.exams.index'), current: route().current('admin.exams.*') },
        { name: 'Assignments', href: route('admin.assignments.index'), current: route().current('admin.assignments.*') },
        { name: 'Results', href: route('admin.results.index'), current: route().current('admin.results.*') },
        { name: 'Attendance', href: route('admin.attendances.index'), current: route().current('admin.attendances.*') },
        { name: 'Events', href: route('admin.events.index'), current: route().current('admin.events.*') },
        { name: 'Messages', href: route('admin.messages.index'), current: route().current('admin.messages.*') },
        { name: 'Announcements', href: route('admin.announcements.index'), current: route().current('admin.announcements.*') },
    ];

    return (
        // Changed h-screen to min-h-screen to prevent white gaps on resize
        <div className="flex min-h-screen h-screen overflow-hidden bg-gray-100">

            {/* Sidebar - Fixed Height with independent scroll */}
            <aside className="hidden w-64 flex-col border-r border-gray-200 shadow-sm sm:flex shrink-0 h-full" style={{ backgroundColor: '#346739' }}>

                {/* Fixed Logo Area */}
                <div className="flex h-20 shrink-0 items-center justify-center border-b border-white/10 px-4">
                    <Link href="/">
                        <ApplicationLogo className="h-12 w-auto" />
                    </Link>
                </div>

                {/* Scrollable Nav Area - Added overflow-y-auto and custom scrollbar styling */}
                <nav className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
                    <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-green-100/50">
                        Menu
                    </div>
                    <div className="flex flex-col space-y-1">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.name}
                                href={item.href}
                                active={item.current}
                                className="flex w-full items-center rounded-lg px-3 py-2 text-white transition-colors hover:bg-white/10"
                            >
                                {item.name}
                            </NavLink>
                        ))}
                    </div>
                </nav>

                {/* Fixed Bottom User Area */}
                <div className="shrink-0 border-t border-white/10 p-4">
                    <div className="flex items-center gap-3 px-2 py-3 text-white">
                        <div className="text-sm font-medium truncate">{user.name}</div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col h-full overflow-hidden">

                {/* Header */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-4 shadow-sm sm:px-6 lg:px-8 z-10">
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 focus:outline-none"
                        >
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="hidden sm:block">
                         <h2 className="text-xl font-semibold text-gray-800">{header}</h2>
                    </div>

                    <div className="flex items-center">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center text-sm font-medium text-gray-500 transition hover:text-gray-700 focus:outline-none">
                                    {user.name}
                                    <svg className="ms-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* Mobile Navigation Dropdown */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden bg-white border-b overflow-y-auto max-h-[calc(100vh-64px)]'}>
                    <div className="space-y-1 pb-3 pt-2">
                        {navigation.map((item) => (
                            <ResponsiveNavLink key={item.name} href={item.href} active={item.current}>
                                {item.name}
                            </ResponsiveNavLink>
                        ))}
                    </div>
                </div>

                {/* Main Content Scrollable Area */}
                <main className="flex-1 overflow-y-auto bg-gray-50 p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
