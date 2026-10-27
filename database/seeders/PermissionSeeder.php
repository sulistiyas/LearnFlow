<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            // User & RBAC Management
            'user.view',
            'user.manage',
            'role.manage',
            'audit.view',

            // Course & Curriculum Management
            'course.view',
            'course.create',
            'course.edit',
            'course.delete',

            // Exam & CBT Management
            'exam.view',
            'exam.create',
            'exam.edit',
            'exam.delete',
            'exam.start',
            'exam.submit',

            // Grading & Evaluation
            'grade.view',
            'grade.revise',
            'grade.export',

            // Proctoring & Anti-Cheat
            'student.violation_view',
            'student.violation_log',

            // Parent & Guardian Management
            'parent.link_student',
            'parent.view_wards',
        ];

        foreach ($permissions as $permissionName) {
            Permission::firstOrCreate([
                'name' => $permissionName,
                'guard_name' => 'web',
            ]);
        }
    }
}
