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
        Schema::create('respuestas_alumno', function (Blueprint $table) {
    $table->id();
    $table->foreignId('intento_id')->constrained('intentos_examen')->onDelete('cascade');
    $table->foreignId('pregunta_id')->constrained('preguntas')->onDelete('cascade');
    $table->foreignId('opcion_seleccionada_id')->nullable()->constrained('pregunta_opciones')->onDelete('cascade');
    $table->text('respuesta_texto')->nullable();
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('respuestas_alumno');
    }
};
