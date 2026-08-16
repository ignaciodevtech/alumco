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
        Schema::create('inscripciones', function (Blueprint $table) {
    $table->id();
    $table->foreignId('curso_id')->constrained('cursos')->onDelete('cascade');
    $table->foreignId('alumno_id')->constrained('users')->onDelete('cascade');
    $table->enum('estado', ['en_progreso', 'completado'])->default('en_progreso');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inscripciones');
    }
};
