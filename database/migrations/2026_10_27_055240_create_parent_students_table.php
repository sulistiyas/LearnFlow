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
        Schema::create('parent_students', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('parent_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUlid('student_id')->constrained('users')->cascadeOnDelete();
            $table->string('relationship', 30)->default('guardian');
            $table->boolean('is_verified')->default(true);
            $table->timestamps();

            $table->unique(['parent_id', 'student_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parent_students');
    }
};
