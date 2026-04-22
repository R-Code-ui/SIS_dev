<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Seed roles and permissions for School Management System
     */
    public function run(): void
    {
        // CRITICAL: Clear cached permissions to avoid "no permission named" errors
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // ==================== PERMISSIONS ====================
        // Admin only modules
        $adminPermissions = [
            'view_teachers', 'manage_teachers',
            'view_students', 'manage_students',
            'view_parents', 'manage_parents',
            'view_subjects', 'manage_subjects',
            'view_classes', 'manage_classes',
            'view_lessons', 'manage_lessons',
            'view_exams', 'manage_exams',
            'view_assignments', 'manage_assignments',
            'view_results', 'manage_results',
            'view_attendance', 'manage_attendance',
            'view_events', 'manage_events',
            'view_messages', 'manage_messages',
            'view_announcements', 'manage_announcements',
        ];

        // Teacher permissions (can manage their own data)
        $teacherPermissions = [
            'view_students', 'view_subjects', 'view_classes',
            'manage_lessons', 'manage_exams', 'manage_assignments',
            'manage_results', 'manage_attendance', 'view_events',
            'view_messages', 'send_messages', 'view_announcements',
        ];

        // Student permissions (view only)
        $studentPermissions = [
            'view_assignments', 'submit_assignments',
            'view_results', 'view_attendance',
            'view_events', 'view_messages', 'send_messages',
            'view_announcements', 'view_my_classes',
        ];

        // Parent permissions (similar to student but for their children)
        $parentPermissions = [
            'view_assignments', 'view_results',
            'view_attendance', 'view_events',
            'view_messages', 'send_messages',
            'view_announcements', 'view_children_classes',
        ];

        // Create permissions using firstOrCreate (no duplicates)
        foreach (array_merge($adminPermissions, $teacherPermissions, $studentPermissions, $parentPermissions) as $perm) {
            Permission::firstOrCreate(['name' => $perm]);
        }

        // ==================== ROLES ====================
        // Admin role - gets all permissions
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->syncPermissions(Permission::all());

        // Teacher role
        $teacherRole = Role::firstOrCreate(['name' => 'teacher']);
        $teacherRole->syncPermissions($teacherPermissions);

        // Student role
        $studentRole = Role::firstOrCreate(['name' => 'student']);
        $studentRole->syncPermissions($studentPermissions);

        // Parent role
        $parentRole = Role::firstOrCreate(['name' => 'parent']);
        $parentRole->syncPermissions($parentPermissions);

        $this->command->info('Roles and permissions seeded successfully!');
    }
}
