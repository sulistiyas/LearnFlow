<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Roles
        $superadmin = Role::firstOrCreate(['name' => 'superadmin', 'guard_name' => 'web']);
        $instructor = Role::firstOrCreate(['name' => 'instructor', 'guard_name' => 'web']);
        $ta = Role::firstOrCreate(['name' => 'teaching_assistant', 'guard_name' => 'web']);
        $student = Role::firstOrCreate(['name' => 'student', 'guard_name' => 'web']);
        $parent = Role::firstOrCreate(['name' => 'parent', 'guard_name' => 'web']);

        // 2. Assign Permissions to Roles
        $superadmin->syncPermissions(Permission::all());

        $instructor->syncPermissions([
            'course.view', 'course.create', 'course.edit', 'course.delete',
            'exam.view', 'exam.create', 'exam.edit', 'exam.delete',
            'grade.view', 'grade.revise', 'grade.export',
            'student.violation_view',
        ]);

        $ta->syncPermissions([
            'course.view',
            'exam.view',
            'grade.view', 'grade.revise',
            'student.violation_view',
        ]);

        $student->syncPermissions([
            'course.view',
            'exam.view', 'exam.start', 'exam.submit',
            'grade.view',
            'student.violation_log',
        ]);

        $parent->syncPermissions([
            'parent.link_student',
            'parent.view_wards',
            'course.view',
            'grade.view',
        ]);

        // 3. Seed Default Superadmin Account
        $admin = User::firstOrCreate(
            ['email' => 'admin@learnflow.io'],
            [
                'name' => 'Super Administrator',
                'username' => 'superadmin',
                'password' => Hash::make('password'),
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $admin->syncRoles([$superadmin]);

        // 4. Seed Default Instructor Account
        $teacher = User::firstOrCreate(
            ['email' => 'guru@learnflow.io'],
            [
                'name' => 'Budi Santoso, M.Kom',
                'username' => 'guru_budi',
                'password' => Hash::make('password'),
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $teacher->syncRoles([$instructor]);

        // 5. Seed Default Student Account
        $pupil = User::firstOrCreate(
            ['email' => 'siswa@learnflow.io'],
            [
                'name' => 'Ahmad Fauzi',
                'username' => 'ahmad_fauzi',
                'student_code' => 'NIS-2026-001',
                'password' => Hash::make('password'),
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $pupil->syncRoles([$student]);

        // 6. Seed Default Parent Account
        $wali = User::firstOrCreate(
            ['email' => 'wali@learnflow.io'],
            [
                'name' => 'Hendra Fauzi (Wali)',
                'username' => 'wali_hendra',
                'password' => Hash::make('password'),
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $wali->syncRoles([$parent]);
    }
}
