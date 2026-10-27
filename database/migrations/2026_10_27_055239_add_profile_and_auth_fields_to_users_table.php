<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username', 50)->nullable()->unique()->after('name');
            $table->string('phone_number', 30)->nullable()->after('email');
            $table->text('avatar_url')->nullable()->after('phone_number');
            $table->string('status', 20)->default('active')->after('avatar_url');
            $table->string('student_code', 30)->nullable()->unique()->after('status');
            $table->timestamp('last_login_at')->nullable()->after('remember_token');
            $table->string('last_login_ip', 45)->nullable()->after('last_login_at');
            $table->softDeletes()->after('updated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->dropColumn([
                'username',
                'phone_number',
                'avatar_url',
                'status',
                'student_code',
                'last_login_at',
                'last_login_ip',
            ]);
        });
    }
};
