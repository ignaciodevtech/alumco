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
        Schema::create('intentos_examen', function (Blueprint $table) {
    $table->id();
    $table->foreignId('curso_id')->constrained('cursos')->onDelete('cascade');
    $table->foreignId('alumno_id')->constrained('users')->onDelete('cascade');
    $table->integer('numero_intento');
    $table->decimal('calificacion', 5, 2)->nullable();
    $table->enum('estado', ['aprobado', 'reprobado', 'pendiente_revision'])->default('pendiente_revision');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('intentos_examen');
    }
};
