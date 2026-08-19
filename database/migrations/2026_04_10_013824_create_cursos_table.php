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
        Schema::create('cursos', function (Blueprint $table) {
    $table->id();
    $table->foreignId('profesor_id')->constrained('users')->onDelete('cascade');
    $table->string('titulo');
    $table->text('descripcion');
    $table->string('imagen_portada')->nullable();
    $table->enum('estado', ['borrador', 'publicado'])->default('borrador');
    $table->integer('exigencia_minima')->default(60);
    $table->integer('max_intentos')->default(2);
    $table->string('ruta_certificado_pdf')->nullable();
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cursos');
    }
};
